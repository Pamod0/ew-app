import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-register-community',
    // templateUrl: './register-community.component.html',
    templateUrl: './register-community.component.html',
    styleUrls: ['./register-community.component.css']
})
export class RegisterCommunityComponent implements OnInit {
    registerForm: FormGroup;
    userTypes: any[] = [
        { name: 'Community', key: 'A' },
        { name: 'Individual', key: 'M' }
    ];

    districts: any[] | undefined;

    constructor() {}

    ngOnInit() {
        this.districts = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' }
        ];

        this.registerForm = new FormGroup({
            selectedUserType: new FormControl(),
            name: new FormControl('', Validators.required),
            address: new FormControl('', Validators.required),
            district: new FormControl('', Validators.required),
            contactPersonName: new FormControl('', Validators.required),
            phoneNumber: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', Validators.required)
        });
    }
}
