import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpaService {

  // Base URL of the Django REST backend. Change here if the API runs elsewhere.
  private baseUrl = 'https://abc123xyz.execute-api.us-east-1.amazonaws.com/api';
  constructor(private http: HttpClient) {}

  // ───────── Services ─────────
  getServices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/service_get/`);
  }
  addService(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/service_create/`, data);
  }
  updateService(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/service_update/${id}`, data);
  }
  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/service_delete/${id}`);
  }

  // ───────── Packages ─────────
  getPackages(): Observable<any> {
    return this.http.get(`${this.baseUrl}/package_get/`);
  }
  addPackage(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/package_create/`, data);
  }
  updatePackage(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/package_update/${id}`, data);
  }
  deletePackage(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/package_delete/${id}`);
  }

  // ───────── Bookings ─────────
  getBookings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/booking_get/`);
  }
  addBooking(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/booking_create/`, data);
  }
  updateBooking(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/booking_update/${id}`, data);
  }
  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/booking_delete/${id}`);
  }

  // ───────── Slots ─────────
  getSlots(): Observable<any> {
    return this.http.get(`${this.baseUrl}/slot_get/`);
  }
  addSlot(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/slot_create/`, data);
  }
  updateSlot(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/slot_update/${id}`, data);
  }
  deleteSlot(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/slot_delete/${id}`);
  }

  // ───────── Schedule ─────────
  getSchedule(): Observable<any> {
    return this.http.get(`${this.baseUrl}/schedule_get/`);
  }
  updateSchedule(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/schedule_update/${id}`, data);
  }

  // ───────── Offers ─────────
  getOffers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/offer_get/`);
  }
  addOffer(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/offer_create/`, data);
  }
  updateOffer(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/offer_update/${id}`, data);
  }
  deleteOffer(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/offer_delete/${id}`);
  }

  // ───────── Customers ─────────
  getCustomers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/customer_get/`);
  }
  addCustomer(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/customer_create/`, data);
  }
  updateCustomer(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/customer_update/${id}`, data);
  }
  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/customer_delete/${id}`);
  }

  // ───────── Staff ─────────
  getStaff(): Observable<any> {
    return this.http.get(`${this.baseUrl}/staff_get/`);
  }
  addStaff(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/staff_create/`, data);
  }
  updateStaff(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/staff_update/${id}`, data);
  }
  deleteStaff(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/staff_delete/${id}`);
  }

  // ───────── Reviews ─────────
  getReviews(): Observable<any> {
    return this.http.get(`${this.baseUrl}/review_get/`);
  }
  updateReview(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/review_update/${id}`, data);
  }

  // ───────── Notifications ─────────
  getNotifications(): Observable<any> {
    return this.http.get(`${this.baseUrl}/notification_get/`);
  }
  updateNotification(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/notification_update/${id}`, data);
  }
  deleteNotification(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/notification_delete/${id}`);
  }

  // ───────── Conversations ─────────
  getConversations(): Observable<any> {
    return this.http.get(`${this.baseUrl}/conversation_get/`);
  }
  updateConversation(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/conversation_update/${id}`, data);
  }

  // ───────── Settings ─────────
  getSettings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/setting_get/`);
  }
  updateSetting(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/setting_update/${id}`, data);
  }

  // ───────── Auth ─────────
  validateLogin(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth_login/`, { username, password });
  }
}
