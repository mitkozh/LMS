import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageService } from 'app/core/image.service';
import { UserService } from 'app/core/user.service';
import { Gender, User } from 'app/shared/user';
import { SelectItem } from 'primeng/api';
import { UploadEvent } from 'primeng/fileupload';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  currentUser: User | undefined;
  genders: SelectItem[] = [
    { label: 'Select gender', value: null }, // Added option to not select any gender
    { label: 'Male', value: 'MALE' },
    { label: 'Female', value: 'FEMALE' },
    { label: 'Other', value: 'OTHER' },
  ];

  userForm: FormGroup; // Declare userForm with explicit type FormGroup

  photo: SafeUrl | undefined;
  initialUser: User | undefined;
  imageNewId: number = -1;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public imageService: ImageService,
    private sanitizer: DomSanitizer
  ) {
    this.userForm = this.fb.group({
      email: [{ value: '', disabled: true }],
      gender: [null], // Set initial value to null
      name: [''], // Added Validators.required for name field
    });
  }

  ngOnInit() {
    this.userService.getCurrentUserInfo().subscribe((user) => {
      this.initialUser = { ...user };
      delete this.initialUser.id;
      delete this.initialUser.pictureId;

      this.currentUser = user;
      this.userForm.patchValue({
        email: this.currentUser.email,
        gender: this.currentUser.gender || null, // Set gender to null if it's not selected
        name: this.currentUser.name,
      });
      if (user.pictureId) {
        this.imageService.getImage(user.pictureId).subscribe((image) => {
          this.photo = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(image)
          );
        });
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid && !this.checkIfInitialUserIsTheSameAsCurrent()) {
      const gender: Gender | null = this.userForm.value.gender; // Explicitly type gender as Gender | null
      const user: User = {
        email: this.userForm.getRawValue().email || '',
        gender: gender !== null ? gender : null,
        name: this.userForm.value.name || '',
        pictureId: this.imageNewId || 0,
      };
      if (user.email || user.name || user.gender || user.pictureId !== -1) {
        this.userService.updateUser(user).subscribe(
          (response) => {
            window.location.reload();
          },
          (error) => {
            console.error('There was an error with the update!', error);
          }
        );
      } else {
        console.error('Invalid form data');
      }
    }
  }

  onUpload(fileEvent: any): void {
    if (fileEvent.originalEvent instanceof HttpResponse) {
      let serverResponse = fileEvent.originalEvent.body;
      if (serverResponse && serverResponse.id) {
        let imageId = serverResponse.id;
        this.imageNewId = imageId;
        console.log(this.imageNewId);
        this.imageService.getImage(imageId).subscribe((profilePic) => {
          this.photo = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(profilePic)
          );
        });
      }
    }
  }

  checkIfInitialUserIsTheSameAsCurrent(): boolean {
    const initialUserNonNull = this.removeNullProperties(this.initialUser);
    const currentUserNonNull = this.removeNullProperties(
      this.userForm.getRawValue()
    );

    const initialUserString = JSON.stringify(
      initialUserNonNull,
      Object.keys(initialUserNonNull).sort()
    );
    const currentUserString = JSON.stringify(
      currentUserNonNull,
      Object.keys(currentUserNonNull).sort()
    );


    const isUserSame = initialUserString === currentUserString;
    const isSameImage = this.imageNewId === -1;

    return isUserSame && isSameImage;
  }

  removeNullProperties(obj: any): any {
    const newObj: { [key: string]: any } = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] !== null && obj[key] !== '') {
        // Check if the property is not null or empty
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }
}
