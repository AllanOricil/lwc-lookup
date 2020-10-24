import { api, LightningElement } from "lwc";

export default class LookupResult extends LightningElement {
  @api searchResult = {};
  @api iconName = null;
  @api showIcon = false;
  @api highlightSearchResult = false;
  @api searchInput = null;

  get searchResultData() {
    if (this.highlightSearchResult) {
        console.log(this.searchInput);
        
      const searchInputIndex = this.searchResult.Name.indexOf(this.searchInput);
      if (searchInputIndex !== -1) {
        return {
          ...this.searchResult,
          highlightedName:
            this.searchResult.Name.substring(0, searchInputIndex) +
            `<strong>${this.searchInput}</strong>` +
            this.searchResult.Name.substring(
              searchInputIndex + this.searchInput.length,
              this.searchResult.Name.length
            )
        };
      } else {
        return {
          ...this.searchResult,
          highlightedName: this.searchResult.Name
        };
      }
    } else {
      return this.searchResult;
    }
  }

  onSelectResult() {
    this.dispatchEvent(
      new CustomEvent("select", { detail: this.searchResult })
    );
  }
}
