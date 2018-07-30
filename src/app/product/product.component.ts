import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(@Inject('IMG_URL') public imgUrl:string) { }

  ngOnInit() {
  }

}
