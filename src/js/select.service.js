class SelectService {
    constructor(){
        this._isItemSelected = false;
        this._selectedItem = {};
    }
    get isItemSelected() {
        return this._isItemSelected;
    }
    get selectedItem() {
        return this._selectedItem;
    }
    set selectedItem(item) {
        this._selectedItem = item;
        this._isItemSelected = true;
    }
    deleteSelectedItem() {
        this._selectedItem = {};
        this._isItemSelected = false;
    }
}

export default SelectService;