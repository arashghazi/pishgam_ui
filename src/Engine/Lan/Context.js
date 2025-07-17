import { settings } from "../BaseSetting";

const ValueList_en = [
    { id: 'save', display: 'Save' },
    { id: 'new', display: 'New' },
    { id: 'delete', display: 'Delete' },
    { id: 'save-new', display: 'Save & New' },
    { id: 'refresh', display: 'Refresh' },
    { id: 'search', display: 'Search' },
    { id: 'refresh-template', display: 'Refresh Template' },
    { id: 'delete-comfirm', display: 'are you sure to delete this item?' },
    { id: 'Save-msg', display: 'Save Successfull' },
    { id: 'noSelect', display: 'None' },
    { id: 'Operation-failed', display: 'Operation failed' },
    { id: 'files-dropzone', display: 'Drop files here or click to upload' },
    { id: 'noCondition', display: 'No Condition' },
    { id: 'delete-msg', display: 'item deleted' },
    { id: 'download', display: 'Download' }

];
const ValueList_fa = [
    { id: 'save', display: 'ذخیره' },
    { id: 'new', display: 'جدید' },
    { id: 'delete', display: 'حذف' },
    { id: 'save-new', display: 'ذخیره و جدید' },
    { id: 'refresh', display: 'بارگزاری' },
    { id: 'search', display: 'جستجو' },
    { id: 'refresh-template', display: 'بارگزاری قالب' },
    { id: 'delete-comfirm', display: 'آیا از حذف این آیتم مطمئن هستید؟' },
    { id: 'Save-msg', display: 'عملیات ذخیره سازی موفقیت آمیز بود' },
    { id: 'noSelect', display: 'انتخاب نشده' },
    { id: 'Operation-failed', display: 'عملیات موفق آمیز نبود' },
    { id: 'files-dropzone', display: 'فایل را اینجا بکشید و یا کلیک کنید' },
    { id: 'noCondition', display: 'بدون شرط' },
    { id: 'delete-msg', display: 'آیتم با موفقیت حذف شد' },
    { id: 'download', display: 'دانلود' }
];
const GetDisplay = (key) => {
    let value;
    if (settings.lang[0] === 'en-US')
        value = ValueList_en.find(x => x.id === key);
    else if (settings.lang[0] === 'fa-IR')
        value = ValueList_fa.find(x => x.id === key);
    return value?.display;
}
export default GetDisplay;