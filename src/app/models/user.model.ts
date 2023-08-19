
export class Login {
    UserName: string;
    Password: string;
    ROLE: string;
    UID: string;
}

export class UserModel {
    UID: string;
    UserName: string;
    Designation: string;
    Mobile: string;
    Email: string;
    LoginID: string;
    Password: string;
    DateofBirth: Date;
    STARTDATE: Date;
    NationalID: string;
    ROLE: string;
    Region: string;
    Territory: string;
}


export class UserList {
    UID: string;
    UserName: string;
    Designation: string;
    Mobile: string;
    Email: string;
    STARTDATE?: Date;
    NationalID: string;
    ROLE: string;
}
