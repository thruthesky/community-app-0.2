import { Component, Input } from '@angular/core';
@Component({
    selector: 'comment-view-component',
    templateUrl: 'comment-view-component.html'
})
export class CommentViewComponent {
    @Input() comment;
    showCommentForm: boolean = false;

    // onClickReply() {
    //     console.log('this.showCommentForm:', this.showCommentForm);
    //     this.showCommentForm = ! this.showCommentForm;
    // }
}