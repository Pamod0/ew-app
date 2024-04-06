import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuItem } from 'primeng/api';
import { Cleanup, Contributor, Product } from './model';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: [
    './landing-page.component.scss',
  ]
})
export class LandingPageComponent implements OnInit {

  items: MenuItem[] | undefined;

  topContributors: Contributor[] | undefined;
  responsiveOptions: any[] | undefined;
  showIndicators: boolean | undefined;
  showNavigators: boolean | undefined;
  verticalViewPortHeight: string | undefined;
  contentClass: string | undefined;

  styleObjCarousel = {};
  styleOBJ = {'background':'#1565D8'};
  cleanups: Cleanup[] | undefined;

  //test
  products: Product[] | undefined;

  constructor(private sanitizer: DomSanitizer) { }


  ngOnInit() {

    // this.showIndicators = false;
    // this.showNavigators = false;

    this.items = [
      {
        label: 'English',
      },
      {
        label: 'Sinhala',
      },
      {
        label: 'Tamil',
      }

    ];

    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1
      }
    ];

    this.topContributors = [
      {
        name: 'John Doe',
        imageUrl: '../../../assets/layout/images/logo-square.png'
      },
      {
        name: 'Jane Doe',
        imageUrl: '../../../assets/layout/images/logo-square.png'
      },
      {
        name: 'John Doe',
        imageUrl: '../../../assets/layout/images/logo-square.png'
      },
    ];

    this.products = [
      {
        id: '1000',
        code: 'f230fh0g3',
        name: 'MAAS',
        description: 'Product Description',
        image: 'carousel-item-1.png',
        price: 65,
        category: 'Accessories',
        quantity: 24,
        inventoryStatus: 'INSTOCK',
        rating: 5
      },
      {
        id: '1001',
        code: 'nvklal433',
        name: 'Clean Ocean Force',
        description: 'Product Description',
        image: 'carousel-item-1.png',
        price: 72,
        category: 'Accessories',
        quantity: 61,
        inventoryStatus: 'INSTOCK',
        rating: 4
      },
      {
        id: '1002',
        code: 'zz21cz3c1',
        name: 'Blue Band',
        description: 'Product Description',
        image: 'carousel-item-1.png',
        price: 79,
        category: 'Fitness',
        quantity: 2,
        inventoryStatus: 'LOWSTOCK',
        rating: 3
      },
      {
        id: '1003',
        code: '244wgerg2',
        name: 'Blue T-Shirt',
        description: 'Product Description',
        image: 'carousel-item-1.png',
        price: 29,
        category: 'Clothing',
        quantity: 25,
        inventoryStatus: 'INSTOCK',
        rating: 5
      },
      {
        id: '1004',
        code: 'h456wer53',
        name: 'Bracelet',
        description: 'Product Description',
        image: 'carousel-item-1.png',
        price: 15,
        category: 'Accessories',
        quantity: 73,
        inventoryStatus: 'INSTOCK',
        rating: 4
      },
      {
        id: '1005',
        code: 'av2231fwg',
        name: 'Brown Purse',
        description: 'Product Description',
        image: 'carousel-item-1.png',
        price: 120,
        category: 'Accessories',
        quantity: 0,
        inventoryStatus: 'OUTOFSTOCK',
        rating: 4
      },
    ];

    this.cleanups = [
      {
        name: 'BEACH CLEANUP <br> EVENT',
        imgUrl: 'our-focus-1.jpg'
      },
      {
        name: 'DEPLOYMENT OF<br> CANAL / RIVER<br> STRAINERS',
        imgUrl: 'our-focus-2.jpg'
      },
      {
        name: 'MAINTENANCE OF<br> CARE TAKERS',
        imgUrl: 'our-focus-3.jpg'
      },
      {
        name: 'FISHERY HARBOUR<br> CLEANUP',
        imgUrl: 'our-focus-4.png'
      },
      {
        name: 'COMPLAINT',
        imgUrl: 'our-focus-4.png'
      },
    ];
  }

  getSafeHtml(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}