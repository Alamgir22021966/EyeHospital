// import { UserList, UserModel } from '@/Models/user.model';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@services/user.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { NewUserComponent } from '../new-user/new-user.component';
import Swal from 'sweetalert2';
import { ShareService } from '@/Shared/share.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  UserListForm: FormGroup;
  bsModalRef: BsModalRef;
  public AllUsers = this.shareService.User.asObservable();

  public placeholder: string = 'Enter Search String';
  public keyword = 'Name';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private shareService: ShareService,
    private toastr: ToastrService,
    private bsModalService: BsModalService,
    private datePipe: DatePipe,
  ) {
    this.CreateUserListForm();
  }

  CreateUserListForm(): void {
    const arr = [];
    for (let i = 0; i < 15; i++) {
      arr.push(this.ListForm());
    }
    this.UserListForm = this.fb.group({
      User: this.fb.group({
        UID: ['']
      }),
      UserList: this.fb.array(arr) as FormArray,
    });
  }

  ListForm(): FormGroup {
    return this.fb.group({
      UID: [''],
      UserName: [''],
      Designation: [''],
      Degrees: [''],
      Mobile: [''],
      Email: [''],
      LoginID: [''],
      Password: [''],
      DateofBirth: [''],
      STARTDATE: [''],
      NationalID: [''],
      ROLE: [''],
      Status: ['']
    });
  }

  get User(): any { return this.UserListForm.get('User'); }

  get UserList(): any {
    return this.UserListForm.get('UserList') as FormArray;
  }

  ngOnInit() {
    this.GetUserList();
    this.GetAllUsers();
    this.User.get('UID').patchValue('All');
  }

  trackByFn(index, item) {
    return item.UID;
  }
  public GetAllUsers(): void {
    this.userService.GetAllUser().subscribe({
      next: Val => {
        this.shareService.datastore.data = Val;
        this.shareService.User.next(Object.assign({}, this.shareService.datastore).data);
        this.shareService.datastore.data.unshift({ Value: "All", Name: 'All' });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  public GetUserList() {

    this.userService.GetUserList().subscribe(
      (data: any) => {
        if (data.length > 0) {
          const controls = this.UserListForm.controls['UserList'] as FormArray;
          for (let i = 0; i < data.length; i++) {
            controls.at(+i).get('UID').setValue(data[i].UID);
            controls.at(+i).get('UserName').setValue(data[i].UserName);
            controls.at(+i).get('Designation').setValue(data[i].Designation);
            controls.at(+i).get('Degrees').setValue(data[i].Degrees);
            controls.at(+i).get('Mobile').setValue(data[i].Mobile);
            controls.at(+i).get('LoginID').setValue(data[i].LoginID);
            controls.at(+i).get('Password').setValue(data[i].Password);
            controls.at(+i).get('Email').setValue(data[i].Email);
            controls.at(+i).get('DateofBirth').setValue(this.datePipe.transform(data[i].DateofBirth, 'dd-MMM-yyyy'));
            controls.at(+i).get('STARTDATE').setValue(this.datePipe.transform(data[i].STARTDATE, 'dd-MMM-yyyy'));
            controls.at(+i).get('NationalID').setValue(data[i].NationalID);
            controls.at(+i).get('ROLE').setValue(data[i].ROLE);
            controls.at(+i).get('Status').setValue(data[i].Status);

            if (i >= 14 && i < data.length - 1) {
              this.UserList.push(this.ListForm());
            }
          }
        }
      }
    );
  }

  selectEvent(item: any) {
    this.UserList.reset();
    for (let j = this.UserList.length; j >= 15; j--) {
      this.UserList.removeAt(j);
    }

    this.userService.GetUser(item.Value).subscribe(
      data => {
        if (data.length > 0) {
          const controls = this.UserListForm.controls['UserList'] as FormArray;
          for (let i = 0; i < data.length; i++) {
            controls.at(+i).get('UID').setValue(data[i].UID);
            controls.at(+i).get('UserName').setValue(data[i].UserName);
            controls.at(+i).get('Designation').setValue(data[i].Designation);
            controls.at(+i).get('Degrees').setValue(data[i].Degrees);
            controls.at(+i).get('Mobile').setValue(data[i].Mobile);
            controls.at(+i).get('LoginID').setValue(data[i].LoginID);
            controls.at(+i).get('Password').setValue(data[i].Password);
            controls.at(+i).get('Email').setValue(data[i].Email);
            controls.at(+i).get('DateofBirth').setValue(this.datePipe.transform(data[i].DateofBirth, 'dd-MMM-yyyy'));
            controls.at(+i).get('STARTDATE').setValue(this.datePipe.transform(data[i].STARTDATE, 'dd-MMM-yyyy'));
            controls.at(+i).get('NationalID').setValue(data[i].NationalID);
            controls.at(+i).get('ROLE').setValue(data[i].ROLE);
            controls.at(+i).get('Status').setValue(data[i].Status);

            if (i >= 14 && i < this.UserList.length - 1) {
              this.UserList.push(this.ListForm());
            }
          }
        }
      }
    );
  }

  public Delete(index: any, UID: any): void {
    if (UID) {
      Swal.fire({
        title: 'Do you want to delete the record?',
        showConfirmButton: true,
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.userService.Delete(UID).subscribe({
            next: res => {
              if (res == null) {
                this.toastr.warning("Deleted Successfully", "User Information");
              }
            },
            error: (err: any) => {
              console.log(err);
            },
            complete: () => {
              this.RemoveDeleteItem(index);
              this.GetAllUsers();
            }
          });
        } else if (result.isDenied) {
          this.toastr.info('Record are not deleted!', 'info');
        }
      })
    }
  }

  public RemoveDeleteItem(index): void {
    this.UserList.removeAt(index);
    this.UserList.push(this.ListForm());
  }

  openModal(index: any, UID: any) {
    this.userService.GetUserInformation(UID).subscribe((data: any) => {
      console.log(data)
      const initialState = {
        title: 'User Information',
        data: data,
        ignoreBackdropClick: true,
        animated: true,
        keyboard: true
      };

      this.bsModalRef = this.bsModalService.show(EditUserComponent, Object.assign({}, { class: 'modal-md', initialState }));

      this.bsModalRef.content.action.subscribe((data: any) => {
        const controls = <FormArray>this.UserListForm.controls['UserList'];
        for (let i = 0; i < controls.length; i++) {
          if (index === i) {
            controls.at(+i).get('UID').setValue(data.UID);
            controls.at(+i).get('UserName').setValue(data.UserName);
            controls.at(+i).get('Designation').setValue(data.Designation);
            controls.at(+i).get('Degrees').setValue(data.Degrees);
            controls.at(+i).get('Mobile').setValue(data.Mobile);
            controls.at(+i).get('LoginID').setValue(data.LoginID);
            controls.at(+i).get('Password').setValue(data.Password);
            controls.at(+i).get('Email').setValue(data.Email);
            controls.at(+i).get('DateofBirth').setValue(this.datePipe.transform(data.DateofBirth, 'dd-MMM-yyyy'));
            controls.at(+i).get('STARTDATE').setValue(this.datePipe.transform(data.STARTDATE, 'dd-MMM-yyyy'));
            controls.at(+i).get('NationalID').setValue(data.NationalID);
            controls.at(+i).get('ROLE').setValue(data.ROLE);
            controls.at(+i).get('Status').setValue(data.Status);
            break;
          }
        }
      });

    });
  }

  public Open(): void {
    const initialState = {
      title: 'User Information',
      ignoreBackdropClick: true,
      animated: true,
      keyboard: true,
    };
    this.bsModalRef = this.bsModalService.show(NewUserComponent, Object.assign({}, { class: 'modal-md', initialState }));
    this.bsModalRef.content.action.subscribe(() => {
      this.GetAllUsers();
      this.GetUserList();
    });
  }

  public setStyles(index) {
    let style;
    const controls = this.UserListForm.controls['UserList'] as FormArray;
    for (let i = 0; i < controls.length; i++) {
      if (controls.at(+index).get('UID').value !== '' && controls.at(+index).get('UID').value !== null) {
        style = {
          'background-color': '#fffeee',
          'color': 'black',
          'font-weight': '400'
        }
      } else {
        style = {
          'background-color': '#fff',
          'color': 'black',
          'font-weight': '400'
        }
      }
    }
    return style;
  }

}
export interface Lookup {
  Value: string;
  Name: string;
}

