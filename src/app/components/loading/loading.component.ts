import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
@Component({
  selector: 'app-loading',
  imports: [MatProgressBarModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnDestroy {
  messages: string[] = [
    'Finding your dream car... stay with us! 🚗✨',
    'Matching you with the perfect ride 🚘💘',
    'The best deals are revving up for you 🔥',
    'Your next adventure is being prepared... 🗺️🚙',
    'Tuning up your personalized car recommendations 🔧',
    'Hold tight! The road to great offers is just ahead 🛣️',
    'Detailing your vehicle selection for a showroom finish ✨',
    'Great things take a few seconds… like your future car 😎',
    'Fueling your experience with unbeatable prices ⛽💵',
    'Scanning thousands of options to find your perfect match 🔍',
    'Loading exclusive offers you won’t want to miss 🎯',
    'You’re one click away from driving your dream 🚀',
    'Negotiating the best prices just for you 🧠💼',
    'Setting up the keys to your next car 🔑🚗',
    'Cruising through our inventory to find your fit 🏁',
    'Creating a tailor-made car experience just for you 👨‍🔧',
    'Just a moment! Your garage is being curated 🏎️',
    'Unlocking the doors to smarter car shopping 🔓',
    'Alfred is working hard to bring you the top deals 🧑‍💻',
    'Ready to start the engine of a new journey with you! 🔥🚘'
  ];
  currentMessage = signal('');
  private index = 0;
  private intervalId?: any;

  ngOnInit() {
    this.currentMessage.set(this.messages[this.index]);
    this.intervalId = setInterval(() => {
      this.index = (this.index + 1) % this.messages.length;
      this.currentMessage.set(this.messages[this.index]);
    }, 2500); // Change message every 2.5 seconds
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
