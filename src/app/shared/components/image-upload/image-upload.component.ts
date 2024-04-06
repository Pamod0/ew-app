import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Dimensions, ImageCroppedEvent, ImageTransform, LoadedImage } from 'ngx-image-cropper';
import { FileUploadModule } from 'primeng/fileupload';


@Component({
  selector: 'image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {

  scale = 1;
  transform: ImageTransform = {};

  imageFile: File;
  imageSrc: any;
  tmpImageSrc: SafeUrl;
  imgErrorMessage: string;
  maintainAspectRatio: boolean = true;

  minImageWidth = 100;
  minImageHeight = 100;

  @Input() aspectRatio: string = '';
  @Input() isBase64 = true;

  @Output() imageCroppedUploadEvent = new EventEmitter<object>();

  @ViewChild("fileInputEl") fileInputEl: ElementRef;
  @ViewChild("editImageElem") editImageEl: ElementRef;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.croppedImage = null;
    this.imageChangedEvent = null;

    if(this.aspectRatio == null || this.aspectRatio == "" || this.aspectRatio == undefined){
      this.maintainAspectRatio = false;
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded(img: LoadedImage) {
    const width = img.original.size.width;
    const height = img.original.size.height;
    console.log('width : ' + width);
    console.log('height : ' + height);
    console.log(img);
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    this.imgErrorMessage = "load Image Failed";
  }

  base64ToFile(data, filename) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  onCropImage() {
    this.imageCroppedUploadEvent.emit(this.croppedImage);
  }

  zoomOut() {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }
  zoomIn() {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

}
