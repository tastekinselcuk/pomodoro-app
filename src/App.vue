<template>
    <div class="container">
      <div class="row">
        <div class="col-8 offset-2 p-2">
          <h1>Pomodoro Sayacı</h1>

          <PomodoroTimer/>


          <h3 class="text-center">Yapılacaklar Listesi</h3>

          <DragAndDrop :tasks="tasks" @updateTasks="updateTasks" />
        </div>
      </div>
    </div>

    <audio id="timerEndedSound">
    <source src="@/assets/sounds/zeus.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
  </audio>



</template>

<script>
import taskService from '@/services/taskService';
import DragAndDrop from '@/components/DragAndDrop.vue';
import PomodoroTimer from '@/components/PomodoroTimer.vue';


export default {
    name: 'PomodoroView',
    components: {
    DragAndDrop,
    PomodoroTimer
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
            this.tasks.push(newTask);

          event.target.value = '';
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


      }
}

</script>

<style lang="css">
/* Sayfa stil tanımları */

/* Pomodoro sayfası özgü stiller */
@import "@/assets/pomodoroStyle.css"; /* Burada stil dosyasını içe aktarıyoruz */
</style>

