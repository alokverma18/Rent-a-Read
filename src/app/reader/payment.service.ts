import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

declare var Razorpay: any;

export interface OrderDetails {
  transactionId: string;
  orderAmount: number;
  orderDate: Date;
  orderStatus: string;
  bookId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
    private apiUrl = environment.apiUrl;
    
    constructor(
      private http: HttpClient,
      private router: Router
    ) {}
    
    orderDetails: OrderDetails = {
      transactionId: '',
      orderAmount: 0,
      orderDate: new Date(),
      orderStatus: 'PENDING',
      bookId: ''
    };
    
    public createTransaction(amount: number, bookId: string): Promise<any> {
      return new Promise((resolve, reject) => {
        const data = {
          amount: amount,
          currency: 'INR',
          notes: {
            bookId: bookId
          },
          receipt: 'receipt#1'
        };
    
        this.http.post(`${this.apiUrl}/payment/create-order`, data)
          .pipe(
            catchError(error => {
              console.error('Error creating order:', error);
              reject(error);
              return throwError(() => new Error(`Create order failed: ${error.message}`));
            })
          )
          .subscribe({
            next: (order: any) => {
              const options = {
                "key": "rzp_test_AXBzvN2fkD4ESK", 
                "amount": order.amount,
                "currency": order.currency,
                "name": "Rent-a-Read",
                "description": "Book Rental Transaction",
                "image": "https://example.com/your_logo",
                "order_id": order.id,
                handler: (response: any) => {
                  if(response != null && response.razorpay_payment_id != null) {
                    this.processResponse(response, order.notes);
                    const details = this.orderDetails
                    resolve({ success: true, details, response });
                  } else {
                    alert("Payment failed..");
                    reject({ success: false, message: "Payment failed" });
                  }
                },
                "notes": order.notes,
                "theme": {
                  "color": "#3399cc"
                }
              };
              const rzp1 = new Razorpay(options);
              rzp1.open();
            },
            error: (error) => {
              console.error('Error creating order:', error);
              reject(error);
            }
          });
      });
    }
    
    processResponse(resp: any, notes: any): void {
      this.orderDetails.transactionId = resp.razorpay_payment_id;
      this.orderDetails.orderStatus = 'SUCCESS';
      this.orderDetails.orderDate = new Date();
      this.orderDetails.bookId = notes.bookId;
      this.router.navigate(['/reader/rentals']);
    }
}
