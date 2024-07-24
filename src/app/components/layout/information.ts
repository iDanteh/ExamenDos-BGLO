import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA , MatDialogModule} from '@angular/material/dialog';

@Component({
    selector: 'app-product-info-dialog',
    standalone: true,
    imports: [MatDialogModule],
    templateUrl: './modalProduct.html',
    styleUrl: './layout.component.css',
})
export class ProductInfoDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
