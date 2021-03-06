import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    PostData,
    File,
    NUMBERS,
    _FILE,
    _POST, _POST_CREATE, _POST_CREATE_RESPONSE,
    _POST_EDIT, _POST_EDIT_RESPONSE
} from './../../../angular-backend/angular-backend';
import { AppService } from './../../services/app-service';
@Component({
    selector: 'post-form-component',
    templateUrl: 'post-form-component.html'
})
export class PostFormComponent implements OnInit {

    @Output() create = new EventEmitter<_POST>();
    @Output() edit = new EventEmitter<_POST>();
    @Output() cancel = new EventEmitter<void>();

    @Input() post_config_id: string;
    @Input() post: _POST = <_POST>{};


    formGroup: FormGroup;
    files: Array<_FILE> = [];

    
    constructor(
        public as: AppService,
        private fb: FormBuilder,
        public file: File,
        private postData: PostData
    ) {
    }

    ngOnInit() {
        this.createForm();
    }
    createForm() {

        if ( this.isCreate() ) {
            this.files = [];
            this.formGroup = this.fb.group({
                title: [],
                content: []
            });
        }
        else { // edit
            this.files = this.post.files ? this.post.files : [];
            this.formGroup = this.fb.group({
                title: [ this.post.title ],
                content: [ this.post.content ]
            });
        }
        

    }


    onSubmit() {
        console.log( this.formGroup.value );
        if ( this.isCreate() ) this.createPost();
        else this.editPost();
    }


    reset() {
        this.files = [];
        this.formGroup.get('title').patchValue('');
        this.formGroup.get('content').patchValue('');
    }

    createSuccess( post: _POST ) {
        this.reset();
        this.create.emit( post );
    }
    editSuccess( post: _POST ) {
        this.reset();
        console.log("emit: ", post);
        this.edit.emit( post );
    }

    onClickCancel() {
        this.cancel.emit();
    }

    createPost() {
        let create = <_POST_CREATE> this.formGroup.value;
        create.post_config_id = this.post_config_id;
        create.file_hooks = this.files.map( (f:_FILE) => f.idx );
        this.postData.create( create ).subscribe( ( res: _POST_CREATE_RESPONSE ) => {
            this.as.posts.unshift( res.data );
            console.log( res );
            this.createSuccess( res.data );
        }, err => this.postData.alert( err ) );
    }

    editPost() {
        let edit = <_POST_EDIT> this.formGroup.value;
        edit.idx = this.post.idx;
        edit.file_hooks = this.files.map( (f:_FILE) => f.idx );
        console.log('post-form-conpoment::editPost()', edit);
        this.postData.edit( edit ).subscribe( ( res: _POST_EDIT_RESPONSE ) => {
            console.log( 'after edit: ', res );
            Object.assign( this.post, res.data ); // two-way binding.
            //this.post = res.data;
            this.editSuccess( res.data );
        }, err => this.postData.alert( err ) );
    }

    isCreate() {
        return this.post === void 0 || this.post.idx === void 0;
    }
    isEdit() {
        return ! this.isCreate();
    }


    
    // onClickLike( choice ) {
    //     this.postData.vote( this.post.idx, choice ).subscribe( res => {
    //         console.log('res: ', res);
    //     }, err => this.postData.alert( err ) );
    // }

}
