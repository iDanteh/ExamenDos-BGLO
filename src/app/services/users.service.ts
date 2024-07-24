import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

  interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar: string;
  creationAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class usersService {
  private users: User[] = [
    { "id": 1, "email": "john@mail.com", "password": "changeme", "name": "Jhon", "role": "customer", "avatar": "https://i.imgur.com/LDOO4Qs.jpg", "creationAt": "2024-07-23T04:38:02.000Z", "updatedAt": "2024-07-23T04:38:02.000Z" },
    { "id": 2, "email": "maria@mail.com", "password": "12345", "name": "Maria", "role": "customer", "avatar": "https://i.imgur.com/DTfowdu.jpg", "creationAt": "2024-07-23T04:38:02.000Z", "updatedAt": "2024-07-23T04:38:02.000Z" },
    // ...otros usuarios
  ];

  constructor() { }

  login(email: string, password: string): Observable<boolean> {
    const user = this.users.find(user => user.email === email && user.password === password);
    return of(user !== undefined);
  }

  register(user: Omit<User, 'id' | 'creationAt' | 'updatedAt'>): Observable<boolean> {
    const newUser: User = {
      ...user,
      id: this.users.length + 1,
      creationAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return of(true);
  }
}
