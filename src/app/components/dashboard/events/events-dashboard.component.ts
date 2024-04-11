import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-events-dashboard',
  templateUrl: './events-dashboard.component.html',
  styleUrls: ['./events-dashboard.component.scss']
})
export class EventsDashboardComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: [
      { title: 'event 1', date: '2024-03-20' },
      { title: 'event 2', date: '2024-03-25' }
    ]
  };

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr)
  }

  options: SelectItem[] = [
    { label: 'Monthly View', value: 'monthlyView' },
    { label: 'Weakly View', value: 'weaklyView' },
    { label: 'Day View', value: 'dayView' }
  ];
  selectedOption: string = 'monthlyView'; // Default option
}