import { api, LightningElement } from "lwc";

export default class LookupResults extends LightningElement {
  @api searchResults = [];
  @api iconName = null;
  @api showIcon = false;
  @api highlightSearchResult = false;
  @api searchInput = null;
  @api showRecentlyViewedRecords = false;

  onSelectResult(event) {
    this.dispatchEvent(new CustomEvent("select", { detail: event.detail }));
  }
}
