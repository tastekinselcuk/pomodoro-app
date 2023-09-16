<template>
  <div class="flex m-10">
    <input type="text" class="form-control mb-2" @keydown.enter="addTodo">

    <draggable class="dragArea list-group w-full" :list="tasks">
        <div v-if="tasks.length > 0">
      <div v-for="task in tasks" :key="task.id" :class="{'completed-item': task.completed, 'uncompleted-item': !task.completed}" class="list-group-item d-flex justify-content-between align-items-center">
        <div>
            <input class="form-check-input" @click="changeStatus(task)" :id="`completed_checkbox_${task.id}`" type="checkbox" v-model="task.completed">
            <label class="form-check-label ms-2" :for="`completed_checkbox_${task.id}`">{{ task.content }}</label>
        </div>
        <button class="btn btn-danger btn-sm" @click="removeItem(task)">Sil</button>

    </div>
    <div class="d-flex justify-content-between align-items-center">
        <small class="textDone">Tamamlanan sayısı: <span class="text-light">{{ completedItemCount }}</span></small>
        <small class="textUndone">Tamamlanmayan sayısı: <span class="text-light">{{ uncompletedItemCount }}</span></small>
    </div>
</div>
<div v-else class="alert alert-warning">Henüz eklenmiş bir yapılacak bulunmamaktadır.</div>


    </draggable>
  </div>
</template>
<script>
  import taskService from '@/services/taskService';
  import { defineComponent } from 'vue'
  import { VueDraggableNext } from 'vue-draggable-next'
  export default defineComponent({
    components: {
      draggable: VueDraggableNext,
    },
  data() {
        return {
          time: 1500, // 25 dakika (25 * 60)
          timeBreak: 300,
          isTimerRunning: false,
          isBreakRunning: false,
          timerInterval: null,
          breakInterval: null,
          isActive: true,
          todoList: [
                {id:1,text:"Testler tamamlanıp mantıkları anlaşılacak", completed:false},
                {id:2,text:"Araç hata resmi döndüren servis tamamlanacak", completed:false},
                {id:3,text:"En azından bir ayrı servis(AuthService) için docker file oluşturularak bireysel çalışıp çalışmadığı kontrol et", completed:false},
                {id:4,text:"github için reatme'yi tamamla", completed:true},
                {id:5,text:"rol tabanlı istek işlemlerini tamamlayıp test et", completed:true},
                {id:6,text:"Endpointlerde T.L. için DTO, Admin için domain erişimini ayarla", completed:false},
            ],
            tasks: [],
            dragging: false,

        };
      },
      mounted() {
          this.fetchTasks();
      },
      computed: {
        formatTime() {
          const minutes = Math.floor(this.time / 60).toString().padStart(2, '0');
          const seconds = (this.time % 60).toString().padStart(2, '0');
          return `${minutes}:${seconds}`;
        },
        formatTimeBreak() {
          const minutes = Math.floor(this.timeBreak / 60).toString().padStart(2, '0');
          const seconds = (this.timeBreak % 60).toString().padStart(2, '0');
          return `${minutes}:${seconds}`;
        },
        completedItemCount() {
          return this.tasks.filter(task => task.completed).length;
        },
        uncompletedItemCount() {
          return this.tasks.filter(task => !task.completed).length;
        }
      },
    methods: {
        updateTasks(updatedTasks) {
      this.tasks = updatedTasks;
    },
        fetchTasks() {
          taskService.getAllTasks()
            .then(response => {
              this.tasks = response.data.sort((a, b) => a.id - b.id);
            })
            .catch(error => {
              console.error('Error fetching tasks:', error);
            });
        },
        //Pomodoro Timer
        startTimer() {
        if (!this.isTimerRunning) {
          this.isTimerRunning = true;
          this.timerInterval = setInterval(() => {
            if (this.time > 0) {
              this.time--;
            } else {
              // Zaman bittiğinde sesi çalmak ve durdurmak
              if (this.time === 0) {
                const audioElement = document.getElementById('timerEndedSound');
                audioElement.currentTime = 0; // Sesin başa sarılmasını sağlar
                audioElement.play();
                
                // 15 saniye sonra sesi durdurmak
                setTimeout(() => {
                  audioElement.pause();
                }, 20000);
              }

              this.stopTimer();
            }
          }, 1000);
        }
      },
        stopTimer() {
          this.isTimerRunning = false;
          clearInterval(this.timerInterval);
        },
        resetTimer() {
          this.time = 1500; // 25 dakika (25 * 60)
          this.isTimerRunning = false;
          clearInterval(this.timerInterval);
        },
        //Pomodoro Break
        startBreak() {
        if (!this.isBreakRunning) {
          this.isBreakRunning = true;
          this.breakInterval = setInterval(() => {
            if (this.timeBreak > 0) {
              this.timeBreak--;
            } else {
              // Zaman bittiğinde sesi çalmak ve durdurmak
              if (this.timeBreak === 0) {
                const audioElement = document.getElementById('timerEndedSound');
                audioElement.currentTime = 0; // Sesin başa sarılmasını sağlar
                audioElement.play();
                
                // 15 saniye sonra sesi durdurmak
                setTimeout(() => {
                  audioElement.pause();
                }, 20000);
              }

              this.stopBreak();
            }
          }, 1000);
        }
      },
        stopBreak() {
          this.isBreakRunning = false;
          clearInterval(this.breakInterval);
        },
        resetBreak() {
          this.timeBreak = 300; // 25 dakika (25 * 60)
          this.isBreakRunning = false;
          clearInterval(this.breakInterval);
        },
        //Switch to another design
        changeTimer(){
            this.isActive = !this.isActive;
            if (!this.isActive) {
              document.querySelector('.timer-content').style.backgroundColor = '#4c9196';
              document.body.style.backgroundColor = '#38858a';
              document.querySelector('input[type="text"]').style.backgroundColor = '#33797d';
            } else {
              document.querySelector('.timer-content').style.backgroundColor = '#c15c5c';
              document.body.style.backgroundColor = '#ba4949';
              document.querySelector('input[type="text"]').style.backgroundColor = '#aa4242';

            }
        },
        addTodo(event) {
          const newTask = {
            content: event.target.value,
          };
          taskService.saveTask(newTask)
            .then(response => {
              console.log('Task saved:', response.data);
              this.fetchTasks(); // Refresh the task list
            })
            .catch(error => {
              console.error('Error saving task:', error);
            });
          event.target.value = '';
        },
        removeItem(task) {
        const taskId = task.id;
        taskService.softDeleteTask(taskId)
          .then(response => {
            if (response.status === 200) {
              this.fetchTasks(); // Refresh the task list after successful deletion
            } else {
              console.error('Error deleting task:', response.data);
            }
          })
          .catch(error => {
            console.error('Error deleting task:', error);
          });
        },
        changeStatus(task) {
          const taskId = task.id;
          taskService.changeTaskStatus(taskId)
            .then(response => {
              if (response.status === 200) {
                const updatedTask = this.todoList.find(t => t.id === taskId);
                updatedTask.completed = !updatedTask.completed;
              } else {
                console.error('Error changing task status:', response.data);
              }
            })
            .catch(error => {
              console.error('Error changing task status:', error);
            });
        }

      },
  })
</script>