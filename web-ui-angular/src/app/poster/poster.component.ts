import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { environment } from '../../environments/environment';
import { PostsService } from '../posts.service';
import { Web3Service, Web3ErrorService } from '../services';
import { MatDialog } from '@angular/material/dialog';
import { PosterStatusDialogComponent } from '../poster-status-dialog/poster-status-dialog.component';
import { TxStatusText } from '../services';
import { TxStatusService } from '../services/tx-status-service';

@Component({
  selector: 'app-poster',
  templateUrl: './poster.component.html',
  styleUrls: ['./poster.component.scss'],
})
export class PosterComponent implements OnInit {
  maxPostLength = environment.maxPostLength;
  inputText = '';
  get txStatus(): TxStatusText | '' {
    return this.txStatusSvc.txStatus;
  }
  get disableInput(): boolean {
    return (
      [
        TxStatusText.PENDING,
        TxStatusText.SUCCESS,
        TxStatusText.FAILED,
      ].includes(this.txStatus as any) || !!this.cannotPostError
    );
  }

  get cannotPostError() {
    return this.errorSvc.noMetamaskError || this.errorSvc.noSignerError;
  }

  constructor(
    private postSvc: PostsService,
    private web3Svc: Web3Service,
    private errorSvc: Web3ErrorService,
    private matDialog: MatDialog,
    private txStatusSvc: TxStatusService
  ) {}

  ngOnInit(): void {
    this.web3Svc.userConnectAccount();
  }

  async post() {
    const hasConnectedAccount = await this.web3Svc.userConnectAccount();
    if (!hasConnectedAccount) {
      return;
    }
    const tx: ethers.providers.TransactionResponse | undefined =
      await this.postSvc.post(this.inputText);
    this.txStatusSvc.txTitle = 'Publishing';
    this.txStatusSvc.txHash = tx?.hash ?? '';
    const dialogRef = this.matDialog.open(PosterStatusDialogComponent, {
      disableClose: true,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((_) => {
      this.txStatusSvc.reset();
    });

    this.txStatusSvc.txStatus = TxStatusText.ERROR;
    return;

    // if (!tx) {
    //   this.txStatusSvc.txStatus = TxStatusText.ERROR;
    //   return;
    // }
    // this.txStatusSvc.txStatus = TxStatusText.PENDING;
    // await tx.wait();
    // console.log('TX mined: ', tx.hash);
    // this.txStatusSvc.txStatus = TxStatusText.SUCCESS;
  }
}
