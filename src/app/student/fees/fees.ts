
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../student/services/data';
import { FeeItem } from '../../student/shared';

@Component({
  selector: 'app-fees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fees.html',
  styleUrls: ['./fees.css']
})
export class Fees {
  fees: FeeItem[] = [];

  constructor(private data: DataService) {
    this.fees = data.getFees();
  }

  pay(fee: FeeItem) {
    if (!fee.paid) {
      this.data.payFee(fee.id);
      this.fees = this.data.getFees();
    }
  }

  statusColor(fee: FeeItem) {
    return fee.paid ? 'green' : 'var(--danger)';
  }
}
