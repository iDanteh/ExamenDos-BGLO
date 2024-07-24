import {
  Component, OnInit, AfterViewInit, ViewChild,
  ChangeDetectionStrategy, inject,
  Inject
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from '../header/header.component';
import { StoreService } from '../../services/store.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { error } from 'console';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductInfoDialogComponent } from './information';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from './confirmation';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule,
    HeaderComponent, MatTableModule, MatPaginatorModule, MatDialogModule,ReactiveFormsModule,
    MatFormFieldModule,MatInputModule,FormsModule,CommonModule,MatSnackBarModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {

  displayedColumns: string[] = ['title', 'image', 'price', 'description', 'actions'];
  data: any[] = [];
  dataSource = new MatTableDataSource<any>(this.data);
  selectedProduct: any = { title: '', image: '', price: '', description: '' };
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(private storeService: StoreService, private router: Router,
    private activateRouter: ActivatedRoute,private snackBar: MatSnackBar,) {
    this.activateRouter.params.subscribe(
      params => {
        this.getProductsDetails(params['title']);
      }
    )
  }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    for (let i = 1; i <= 20; i++) {
      this.storeService.getProducts(i).subscribe(
        res => {
          if (res && res.image) {
            let storedData = {
              id: res.id,
              image: res.image,
              price: res.price,
              description: res.description,
              title: res.title,
              aditional: {
                category: res.category
              },
              rating: res.rating,
            };
            this.data.push(storedData);
            this.dataSource = new MatTableDataSource(this.data);
            this.dataSource.paginator = this.paginator;
          } else {
            console.log(`El producto con id ${i} no tiene la estructura esperada`, res);
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  getRow(row: any) {
    this.openProductInfoDialog(row)
  }

  image = '';
  name = '';
  description = '';
  getProductsDetails(title: any) {
    this.storeService.getProducts(title).subscribe(
      res => {
        this.image = res;
        this.name = res.title;
        this.description = res.description;
      },
      error => {
        console.log(error);
      }
    )
  }

  //Formularios
  readonly dialog = inject(MatDialog);

  validateProduct(product: any): boolean {
    return product.title && product.price && product.description && product.image;
  }
  openProductInfoDialog(product: any) {
    this.dialog.open(ProductInfoDialogComponent, {
      data: product
    });
  }

  openErrorDialog(message: string) {
    this.dialog.open(DialogContentExampleDialog2, {
      data: { message },
    });
  }


  editProduct(product: any) {
    this.selectedProduct = { ...product };
  }

  updateProduct() {
    if (!this.validateProduct(this.selectedProduct)) {
      console.log('Todos los campos deben estar llenos para actualizar el producto.');
      this.openErrorDialog('error');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px', height: '400px',
      data: { title: 'Confirmar actualización', message: '¿Estás seguro de que quieres actualizar este producto?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.selectedProduct.id) {
          this.storeService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe(
            response => {
              console.log('Producto actualizado', response);
              const index = this.data.findIndex(item => item.id === this.selectedProduct.id);
              if (index !== -1) {
                this.data[index] = { ...this.selectedProduct };
                this.dataSource.data = [...this.data];
                this.selectedProduct = { title: '', image: '', price: '', description: '' }; 

                this.snackBar.open('Producto actualizado con éxito', 'Cerrar', {
                  duration: 2000,
                  verticalPosition: 'top',
                  horizontalPosition: 'right',
                });
              }
            },
            error => {
              console.log(error);
              this.snackBar.open('Error al actualizar producto', 'Cerrar', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'right',
              });
            }
          );
        }
      }
    });
  }

  addProduct() {
    if (!this.validateProduct(this.selectedProduct)) {
      console.log('Todos los campos deben estar llenos para actualizar el producto.');
      this.openErrorDialog('error');
      return;
    }
    
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Confirmar adición', message: '¿Estás seguro de que quieres agregar este producto?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.storeService.newProduct(this.selectedProduct).subscribe(
          response => {
            console.log('Producto agregado', response);
            this.data.push(response);
            this.dataSource.data = [...this.data];
            this.selectedProduct = { title: '', image: '', price: '', description: '' }; // Reset selectedProduct

            // Show success notification
            this.snackBar.open('Producto agregado con éxito', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
            });
          },
          error => {
            console.log('Error al agregar producto', error);
            this.snackBar.open('Error al agregar producto', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
            });
          }
        );
      }
    });
  }

  deleteProduct(element: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { title: 'Confirmar eliminación', message: '¿Estás seguro de que quieres eliminar este producto?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.storeService.deleteProduct(element.id).subscribe(
          response => {
            console.log('Producto eliminado', response);
            this.data = this.data.filter(item => item.id !== element.id);
            this.dataSource.data = this.data;
            this.snackBar.open('Producto eliminado con éxito', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
            });
          },
          error => {
            console.log(error);
            this.snackBar.open('Error al eliminar producto', 'Cerrar', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
            });
          }
        );
      }
    });
  }
}

@Component({
  selector: 'app-layout',
  templateUrl: 'modalProduct.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogContentExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}

@Component({
  selector: 'app-layout',
  templateUrl: 'erroDialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogContentExampleDialog2 {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
