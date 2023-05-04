import { FoodService } from './../../../services/food.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { food } from 'src/app/shared/models/food';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  implements OnInit{

  foods:food[] = [];

  constructor(private foodService:FoodService, activatedRoute:ActivatedRoute) {
    let foodsObservable:Observable<food[]>;
    activatedRoute.params.subscribe((params)=>{
      if(params.searchTerm)
      foodsObservable = this.foodService.getAllFoodsBySearchTerm(params.searchTerm);
      else if(params.tag)
      foodsObservable = this.foodService.getAllFoodsByTag(params.tag);
      else
      foodsObservable = foodService.getAll();

      foodsObservable.subscribe((serverFoods)=>{
        this.foods = serverFoods
      })


    })
    
  }

  ngOnInit(): void {
  }

}
