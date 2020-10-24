import { api, LightningElement } from 'lwc';
import fetchSObjectResults from '@salesforce/apex/LookupController.fetchSObjectResults';
import fetchRecentlyViewed from '@salesforce/apex/LookupController.fetchRecentlyViewed';

export default class Lookup extends LightningElement {

    @api label = 'Lookup Label';
    @api placeholder = 'Search';
    @api required = false;
    @api sobjectName = 'Account';
    @api maxNumberOfResults = 5;
    @api iconName = 'standard:empty';
    @api showIcon = false;
    @api highlightSearchResult = false;
    @api showRecentlyViewedRecords = false;
    @api error = {
        message: 'This field is required'
    }

    searchInput = null;
    searchResults = [];
    isFetchingRecords = false;
    typingTimeoutId = null;
    selectedResult = null;
    displayResults = false;

    onKeyUp(event){
        clearTimeout(this.typingTimeoutId);
        this.searchInput = event.target.value;
        if(this.searchInput && !this.isFetchingRecords)
            this.typingTimeoutId = 
                setTimeout(() => {
                    this.isFetchingRecords = true;
                    fetchSObjectResults({
                        sobjectName: this.sobjectName, 
                        searchInput: this.searchInput, 
                        maxNumberOfResults: this.maxNumberOfResults 
                    })
                    .then((result) => {
                        this.searchResults = result;
                        this.isFetchingRecords = false;
                        if(result && result.length > 0) this.displayResults = true;
                        else this.displayResults = false;
                    })
                    .catch((error) => {
                        console.error(error);
                        this.isFetchingRecords = false;
                        this.displayResults = false;
                    })
                }, 500);
    }

    onClickInput(event){
        if(this.showRecentlyViewedRecords && !this.searchInput){
            const inputWrapper = event.target.parentElement;
            inputWrapper.classList.add('focused');
            if(!this.isFetchingRecords){
                this.isFetchingRecords = true;
                fetchRecentlyViewed({
                    sobjectName: this.sobjectName,
                    maxNumberOfResults: this.maxNumberOfResults 
                })
                .then((result) => {
                    this.searchResults = result;
                    this.isFetchingRecords = false;
                    if(result && result.length > 0) this.displayResults = true;
                    else this.displayResults = false;
                })
                .catch((error) => {
                    console.error(error);
                    this.isFetchingRecords = false;
                })
            }
        }

        if(this.searchResults && this.searchResults.length > 0) this.displayResults = true;
    }

    onBlurInput(event){
        const inputWrapper = event.target.parentElement;
        inputWrapper.classList.remove('focused');
    }

    onSelectResult(event){
        this.selectedResult = event.detail;
        this.displayResults = false;
        this.searchInput = null;
        this.dispatchEvent(new CustomEvent('select', { detail: event.detail }));
    }

    onClickClearSelection(){
        this.selectedResult = null;
        this.searchInput = null;
        this.dispatchEvent(new CustomEvent('clear'));
    }

    get displayResultsClass(){
        if(this.selectedResult) this.displayResults = false;
        return this.displayResults ? '' : 'slds-hide';
    }
}