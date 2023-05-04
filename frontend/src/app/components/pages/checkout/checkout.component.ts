import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import { Order } from 'src/app/shared/models/Order';
import {
  IPayPalConfig,
  ICreateOrderRequest 
} from 'ngx-paypal';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  // paypal
  public payPalConfig ? : IPayPalConfig;

  makepaymentStatus:boolean=false

  order:Order = new Order();
  checkoutForm!: FormGroup

  showSuccess:boolean=false
  showCancel:boolean=false
  showError:boolean=false

 constructor(cartService:CartService,
  private formBuilder: FormBuilder,
  private userService: UserService,
  private toastrService: ToastrService) {
      const cart= cartService.getCart();
      this.order.items =cart.items;
      this.order.totalPrice = cart.totalPrice;
  }

 ngOnInit(): void {
  let {name, address} = this.userService.currentUser;
  this.checkoutForm = this.formBuilder.group({
    name:[name, Validators.required],
    address:[address, Validators.required]
  });

  this.initConfig();
   
 }

 get fc(){
  return this.checkoutForm.controls
 }

 createOrder(){
  if(this.checkoutForm.invalid){
    this.toastrService.warning('please fill the inputs', 'Invalid Inputs');
    return;
  }

  this.order.name = this.fc.name.value;
  this.order.address = this.fc.address.value;

  console.log(this.order);
  
 }

 makepayment(){
  this.makepaymentStatus=true
 }

 //paypal function
 private initConfig(): void {
  this.payPalConfig = {
      currency: 'EUR',
      clientId: 'sb',
      createOrderOnClient: (data) => < ICreateOrderRequest > {
          intent: 'CAPTURE',
          purchase_units: [{
              amount: {
                  currency_code: 'EUR',
                  value: '9.99',
                  breakdown: {
                      item_total: {
                          currency_code: 'EUR',
                          value: '9.99'
                      }
                  }
              },
              items: [{
                  name: 'Enterprise Subscription',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                      currency_code: 'EUR',
                      value: '9.99',
                  },
              }]
          }]
      },
      advanced: {
          commit: 'true'
      },
      style: {
          label: 'paypal',
          layout: 'vertical'
      },
      onApprove: (data, actions) => {
          console.log('onApprove - transaction was approved, but not authorized', data, actions);
          actions.order.get().then((details:any )=> {
              console.log('onApprove - you can get full order details inside onApprove: ', details);
          });
        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            this.showSuccess = true;
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
            this.showCancel = true;

        },
        onError: err => {
            console.log('OnError', err);
            this.showError = true;
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
            // this.resetStatus();
        }
    };
}

}
