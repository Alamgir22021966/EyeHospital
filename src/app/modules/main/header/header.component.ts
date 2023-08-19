import {AppState} from '@/store/state';
import {ToggleControlSidebar, ToggleSidebarMenu} from '@/store/ui/actions';
import {UiState} from '@/store/ui/state';
import {Component, HostBinding, OnInit} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import {Store} from '@ngrx/store';
import {AppService} from '@services/app.service';
import { LoginService } from '@services/login.service';
import {filter, map, Observable} from 'rxjs';

const BASE_CLASSES = 'main-header navbar navbar-expand';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    @HostBinding('class') classes: string = BASE_CLASSES;
    public ui: Observable<UiState>;
    public searchForm: FormGroup;

    public Title: any;

    constructor(
      private appService: AppService,
      private store: Store<AppState>,
      private loginservice: LoginService,
      private activatedRoute: ActivatedRoute,
      private router: Router) {
      this.SetTitle();
    }

    ngOnInit() {
            // this.ui = this.store.select('ui');
            //  this.ui.subscribe((state: UiState) => {
            //      this.classes = `${BASE_CLASSES} ${state.navbarVariant}`;
            //  });

        this.searchForm = new FormGroup({
          search: new FormControl(null)
        });
      }

    // ngOnInit() {
    //     this.ui = this.store.select('ui');
    //     this.ui.subscribe((state: UiState) => {
    //         this.classes = `${BASE_CLASSES} ${state.navbarVariant}`;
    //     });
    //     this.searchForm = new UntypedFormGroup({
    //         search: new UntypedFormControl(null)
    //     });
    // }

    // logout() {
    //     this.appService.logout();
    // }

    logout() {
        this.loginservice.logout();
        localStorage.clear();
      }

      public SetTitle(): void {
        this.router.events.pipe(
          filter((event) => event instanceof NavigationEnd),
          map(() => this.activatedRoute.snapshot),
          map(route => {
            while (route.firstChild) {
              route = route.firstChild;
            }
            return route;
          })
        ).subscribe((route: ActivatedRouteSnapshot) => {
          this.Title = route.data.title;
        });

        this.activatedRoute.paramMap.subscribe(params => { 
          console.log(params);
          //  this.id = params.get('id'); 
          //  let products=this._productService.getProducts();
          //  this.product=products.find(p => p.productID==this.id);    
       });
       
      }
    

    onToggleMenuSidebar() {
        this.store.dispatch(new ToggleSidebarMenu());
    }

    onToggleControlSidebar() {
        this.store.dispatch(new ToggleControlSidebar());
    }
}
