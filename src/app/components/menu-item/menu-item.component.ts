import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {openCloseAnimation, rotateAnimation} from './menu-item.animations';

@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss'],
    animations: [openCloseAnimation, rotateAnimation]
})
export class MenuItemComponent implements OnInit {
    @Input() menuItem: any = null;
    public isExpandable: boolean = false;
    @HostBinding('class.nav-item') isNavItem: boolean = true;
    @HostBinding('class.menu-open') isMenuExtended: boolean = false;
    public isMainActive: boolean = false;
    public isOneOfChildrenActive: boolean = false;

    constructor(private router: Router) {}

    ngOnInit(): void {
        if (
            this.menuItem &&
            this.menuItem.children &&
            this.menuItem.children.length > 0
        ) {
            this.isExpandable = true;
        }
        this.calculateIsActive(this.router.url);
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.calculateIsActive(event.url);
            });
    }

    public handleMainMenuAction() {
        if (this.isExpandable) {
            this.toggleMenu();
            return;
        }
        this.router.navigate(this.menuItem.path);
    }

    public toggleMenu() {
        this.isMenuExtended = !this.isMenuExtended;
    }

    public calculateIsActive(url: string) {
        this.isMainActive = false;
        this.isOneOfChildrenActive = false;
        if (this.isExpandable) {
            this.menuItem.children.forEach((item) => {
                if (item.path[0] === url) {
                    this.isOneOfChildrenActive = true;
                    this.isMenuExtended = true;
                }
            });
        } else if (this.menuItem.path[0] === url) {
            this.isMainActive = true;
        }
        if (!this.isMainActive && !this.isOneOfChildrenActive) {
            this.isMenuExtended = false;
        }
    }

    public GetClass(caption: any){
        var classList='';
        if(caption === 'Administrator Panel'){
           classList = 'fas fa-folder-open'; 
        } else if (caption === 'Prescription'){
            classList = 'fas fa-folder-open';
        } else if (caption === 'Purchase Information'){
            classList = 'fas fa-folder-open';
        } else if (caption === 'Patient Information'){
            classList = 'fas fa-folder-open';
        } else if (caption === 'Purchase Reports'){
            classList = 'fas fa-signal';
        } else if (caption === 'Sales Reports'){
            classList = 'far fa-chart-bar';
        } else if (caption === 'Dashboard'){
            classList = 'fas fa-tachometer-alt';
        } else if (caption === 'Blank'){
            classList = 'fas fa-folder-open';
        } else if (caption === 'General Information'){
            classList = 'fas fa-folder-open';
        // } else if (caption === 'Data Visualization'){
        //     classList = 'far fa-chart-bar';
        }
        
        return classList;
      }
      
      public GetClass1(caption: any){
        var classList='';
        if(caption === 'Dashboard'){
           classList = "{'box-shadow':'rgb(0 0 0 / 25%) 0 1px 0, inset rgb(255 255 255 / 16%) 0 1px 0'}";
        }
        return classList
      }

      public GetColor(caption: any) {
        switch (caption) {
          case 'Dashboard':
            return '#DAA82F';
          case 'Administrator Panel':
            return '#DAA82F';
          case 'Purchase Information':
            return '#DAA82F';
          case 'Patient Information':
            return '#DAA82F';
          case 'Prescription':
            return '#DAA82F';
          case 'Sales Reports':
            return '#DAA82F';
          case 'General Information':
            return '#DAA82F';
        }
      }
}
