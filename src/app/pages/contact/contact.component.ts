import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  constructor() { }

  ngOnInit(): void {
  }

  submitForm() {
    alert(`Thank you for your message, ${this.formData.name}! We'll get back to you soon.`);
    this.formData = { name: '', email: '', subject: '', message: '' };
  }
}
