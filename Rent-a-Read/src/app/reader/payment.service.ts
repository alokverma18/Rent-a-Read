import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
// import * as Razorpay from 'razorpay';

declare var Razorpay: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

    private apiUrl = 'https://rent-a-read.onrender.com/';

    constructor(
      private http: HttpClient,
      private router: Router
    ) {}

    orderDetails = {
      transactionId: '',
      orderAmount: 0,
      orderDate: new Date(),
      orderStatus: 'PENDING',
      bookId: ''
    };

    public createTransaction(amount: Number, bookId: string): Promise<any> {
      return new Promise((resolve, reject) => {
        const data = {
          amount: amount,
          currency: 'INR',
          notes: {
            bookId: bookId
          },
          receipt: 'receipt#1'
        };
    
        this.http.post(`${this.apiUrl}/payment/create-order`, data).subscribe((order: any) => {
          console.log('Order:', order);
      
          var options = {
            "key": "rzp_test_AXBzvN2fkD4ESK", 
            "amount": order.amount,
            "currency": order.currency,
            "name": "Rent-a-Read",
            "description": "Book Rental Transaction",
            "image": "https://example.com/your_logo",
            "order_id": order.id,
            handler: (response: any) => {
              if(response != null && response.razorpay_payment_id != null) {
                // alert("Payment successful..");
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
          var rzp1 = new Razorpay(options);
          rzp1.open();
        }, (error) => {
          console.error('Error creating order:', error);
          reject(error);
        });
      });
    }
    
  
    processResponse(resp: any, notes: any) {
      this.orderDetails.transactionId = resp.razorpay_payment_id;
      this.orderDetails.orderStatus = 'SUCCESS';
      this.orderDetails.orderDate = new Date();
      this.orderDetails.bookId = notes.bookId;
      console.log('Order Details:', this.orderDetails);

      this.router.navigate(['/reader/rentals']);
      // this.placeOrder(orderForm);
    }

}
