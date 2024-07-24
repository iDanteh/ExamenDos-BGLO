import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../services/store.service';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

export interface DialogData {
  message: string;
}

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, MatButtonModule,HeaderComponent],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {

  newProduct: any = {
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
  };

  storeService = inject(StoreService);

  constructor(public dialog: MatDialog, private router: Router) {}

  onAddProduct() {
    if (!this.newProduct.name || !this.newProduct.price || !this.newProduct.description ||
        !this.newProduct.image || !this.newProduct.category) {
      this.openDialog('Campos inválidos');
      return;
    }

    this.storeService.newProduct(this.newProduct).subscribe({
      next: response => {
        this.openDialog2('Producto agregado exitosamente');
        this.router.navigate(['/layout']);
      },
      error: error => {
      }
    });
  }

  openDialog(message: string) {
    this.dialog.open(DialogDataExampleDialog, {
      data: { message },
    });
  }

  openDialog2(message: string) {
    this.dialog.open(DialogDataExampleDialog2, {
      data: { message },
    });
  }
}

@Component({
  selector: 'dialog-data-example-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent],
  templateUrl: './dialog.html',
})
export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}

@Component({
  selector: 'dialog-data-example-dialog2',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent],
  templateUrl: './dialog2.html',
})
export class DialogDataExampleDialog2 {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
