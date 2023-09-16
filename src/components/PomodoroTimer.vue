<template>

<div class="timer-content">
            
            <ul class="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
              <li class="login nav-item" @click="changeTimer" role="presentation">
                <a class="nav-link" :class="[isActive ? 'active' : '']" :style="isActive ? 'background-color: #a44e4e; color: #fff;' : 'background-color: transparent; color: #000;'" id="tab-login" href="#" data-mdb-toggle="pill" role="tab"
                            aria-controls="pills-login" aria-selected="true">Pomodoro</a>
              </li>
              <li class="register nav-item" @click="changeTimer" role="presentation">
                <a class="nav-link" :class="[!isActive ? 'active' : '']" :style="isActive ? 'background-color: transparent; color: #000;' : 'background-color: #417b80; color: #fff;'" id="tab-register" href="#" data-mdb-toggle="pill" role="tab"
                            aria-controls="pills-register" aria-selected="false">Kısa Ara</a>
              </li>
            </ul>

           <div class="tab-content">
            <div class="tab-pane fade show " :class="[isActive ? 'active' : '']" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
              <div class="timer">
              <div class="time">{{ formatTime }}</div>
              <div class="pomodoro">
                <button @click="startTimer" :disabled="isTimerRunning">Başlat</button>
                <button @click="stopTimer" :disabled="!isTimerRunning">Durdur</button>
                <button @click="resetTimer" :disabled="!isTimerRunning">Sıfırla</button>
              </div>
            </div>
            </div>
            <div class="tab-pane fade show" :class="[!isActive ? 'active' : '']" id="pills-register" role="tabpanel" aria-labelledby="tab-register">
              <div class="timerBreak">
              <div class="timeBreak">{{ formatTimeBreak }}</div>
              <div class="break">
                <button @click="startBreak" :disabled="isBreakRunning">Başlat</button>
                <button @click="stopBreak" :disabled="!isBreakRunning">Durdur</button>
                <button @click="resetBreak" :disabled="!isBreakRunning">Sıfırla</button>
              </div>
            </div>            
          </div>
           </div>
          </div>

</template>

<script>
  import { defineComponent } from 'vue'
  export default defineComponent({
  data() {
        return {
          time: 1500, // 25 dakika (25 * 60)
          timeBreak: 300,
          isTimerRunning: false,
          isBreakRunning: false,
          timerInterval: null,
          breakInterval: null,
          isActive: true,
        };
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
      },
    methods: {
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

      },
  })
</script>
