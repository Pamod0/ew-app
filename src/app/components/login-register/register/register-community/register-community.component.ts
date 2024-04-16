import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    Renderer2,
    AfterViewInit,
    ViewEncapsulation
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-register-community',
    // templateUrl: './register-community.component.html',
    templateUrl: './register-community.component.html',
    styleUrls: ['./register-community.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RegisterCommunityComponent implements OnInit, AfterViewInit {
    _innerHeight: number;
    registerForm: FormGroup;

    userTypes: any[] = [
        { name: 'Community', key: 'A' },
        { name: 'Individual', key: 'M' }
    ];

    districts: any[] | undefined;

    @ViewChild('elementRef', { static: false }) elementRef: ElementRef;

    constructor(private renderer: Renderer2) {}

    ngOnInit() {
        this.districts = [
            { name: 'Kandy', code: 'KD' },
            { name: 'Matale', code: 'MT' },
            { name: 'Nuwara Eliya', code: 'NE' },
            { name: 'Ampara', code: 'AP' },
            { name: 'Batticaloa', code: 'BT' },
            { name: 'Trincomalee', code: 'TC' },
            { name: 'Anuradhapura', code: 'AD' },
            { name: 'Polonnaruwa', code: 'PL' },
            { name: 'Jaffna', code: 'JF' },
            { name: 'Kilinochchi', code: 'KL' },
            { name: 'Mannar', code: 'MN' },
            { name: 'Mullaitivu', code: 'MU' },
            { name: 'Vavuniya', code: 'VV' },
            { name: 'Kurunegala', code: 'KG' },
            { name: 'Puttalam', code: 'PT' },
            { name: 'Kegalle', code: 'KL' },
            { name: 'Ratnapura', code: 'RT' },
            { name: 'Galle', code: 'GL' },
            { name: 'Hambantota', code: 'HB' },
            { name: 'Matara', code: 'MT' },
            { name: 'Badulla', code: 'BD' },
            { name: 'Monaragala', code: 'MG' },
            { name: 'Colombo', code: 'CB' },
            { name: 'Gampaha', code: 'GP' },
            { name: 'Kalutara', code: 'KT' }
        ];

        this.registerForm = new FormGroup({
            selectedUserType: new FormControl(),
            name: new FormControl('', Validators.required),
            address: new FormControl('', Validators.required),
            district: new FormControl('', Validators.required),
            contactPersonName: new FormControl('', Validators.required),
            phoneNumber: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', Validators.required),
            confirmPassword: new FormControl('', Validators.required)
        });
    }

    ngAfterViewInit() {
        this._innerHeight = window.innerHeight;
        this.renderer.setStyle(
            this.elementRef.nativeElement,
            'height',
            `${this._innerHeight}px`
        );
    }
}
