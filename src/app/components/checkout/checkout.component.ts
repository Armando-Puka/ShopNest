import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
    constructor(private route: Router, private cartService: CartService) {
    }

    proceedCheckout() {
        let code = this.checkoutCode().toString();
        let promptValue = prompt(`Please type this code: ${code}`);

        if (promptValue === code) {
            this.cartService.clearCart();
            alert('Products bought successfully!');
            this.route.navigate(['/']);
        } else if (promptValue !== code){
            alert('Please put the correct code in the prompt.');
        } else {
            alert('Checkout failed.');
        }
    }

    cancelCheckout() {
        this.route.navigate(['/cart']);
    }

    private checkoutCode() {
        return Math.floor(100000 + Math.random() * 900000);
    }
}
