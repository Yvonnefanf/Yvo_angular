import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-left-container',
  templateUrl: './left-container.component.html',
  styleUrls: ['./left-container.component.less'],
})

export class LeftContainerComponent implements OnInit {

  constructor() { }
  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
  ngOnInit(): void {
  }

}
