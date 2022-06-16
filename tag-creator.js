const tagForm = document.querySelector('.tag-form')
const addButton = document.querySelector('.add-button')
const tagsArea = document.querySelector('.tags-area')
const radioInstall = document.getElementById('install')
const radioReset = document.getElementById('reset')

class TagCreator {
    constructor(tagForm, addButton, tagsArea, radioInstall, radioReset) {
        this.tagForm = tagForm
        this.addButton = addButton
        this.tagsArea = tagsArea
        this.radioInstall = radioInstall
        this.radioReset = radioReset

        this.addButton.addEventListener('click', () => this.addTag())
        this.deleteTag = this.deleteTag.bind(this);

        this.radioInstall.addEventListener('change', (e) => this.changeReadonly(e))
        this.radioReset.addEventListener('change', (e) => this.changeReadonly(e))

        this.arrayLocalStorage = []
        this.fillTagFromLocalStorage()
    }

    fillTagFromLocalStorage() {
        const d = localStorage.getItem("tag_editor_data");
        if (d !== null) {    
            this.arrayLocalStorage = JSON.parse(d)
            for (let text of this.arrayLocalStorage) {
                this.createTag(text)
            } 
        }
    }

    createTag(value) {
        const tag = document.createElement('div');
        tag.className = 'tag';

        const tagValue = document.createElement('span');
        tagValue.className ='tag-value';
        tagValue.textContent = value;

        const deleteButton = document.createElement('button');
        deleteButton.className ='delete';
        deleteButton.textContent = 'x';

        tag.appendChild(tagValue);
        tag.appendChild(deleteButton);

        this.tagsArea.insertBefore(tag, this.tagForm);

        deleteButton.addEventListener('click', this.deleteTag);
    }

    addTag() {
        const value = this.tagForm.value.trim();
        if (value == '') {
            return 
        }
        const index = this.arrayLocalStorage.indexOf(this.tagForm.value);
        if (index !== -1) {
            return
        } 
        this.createTag(value)
        
        this.arrayLocalStorage.push(value)
        localStorage.setItem("tag_editor_data", JSON.stringify(this.arrayLocalStorage))
        
        this.tagForm.value = '';
    }

    deleteTag(event) {
        const parentElem = event.target.parentElement;
        this.tagsArea.removeChild(parentElem)

        const tagValue = parentElem.querySelector('.tag-value');
        const text = tagValue.textContent;
        
        this.removeTagFromLocalStorage(text)
    }

    removeTagFromLocalStorage(value) {
        //
        let d = localStorage.getItem("tag_editor_data");
        d = JSON.parse(d);
        //
        let index = d.indexOf(value);
        d.splice(index, 1);

        this.arrayLocalStorage = d;
        localStorage.setItem("tag_editor_data", JSON.stringify(this.arrayLocalStorage))
    }

    get listTag() {
        return this.arrayLocalStorage
    }

    set listTag(values) {
        const parent = document.querySelector('.tags-area');

        while (parent.firstChild) {
        parent.firstChild.remove()
        }

        this.arrayLocalStorage = [];

        for (let value of values) {
            this.arrayLocalStorage.push(value)
            this.createTag(value)
        }

        localStorage.setItem("tag_editor_data", JSON.stringify(this.arrayLocalStorage))   
    }

    set adding(value) {
        this.createTag(value)

        this.arrayLocalStorage.push(value)
        localStorage.setItem("tag_editor_data", JSON.stringify(this.arrayLocalStorage))
    }

    set remove(value) {
        const allTagValue = document.querySelectorAll('.tag-value');

        for (let tagValue of allTagValue) {
            if (tagValue.textContent == value) {
                let parentElem = tagValue.parentElement
                this.tagsArea.removeChild(parentElem)
            }
        }
        this.removeTagFromLocalStorage(value)
    }

    set readonly(value) {
        this.tagForm.readOnly = value;
        const addButton = document.querySelectorAll(".delete")
        for (let btn of addButton) {
            btn.disabled = valueInput == "install";
        }
    } 

    changeReadonly(event) {
        const valueInput = event.target.value;
        const addButton = document.querySelectorAll(".delete")
        this.tagForm.readOnly = valueInput == "install";
        for (let btn of addButton) {
            btn.disabled = valueInput == "install";
        }
    }
}

const tagCreator = new TagCreator(tagForm, addButton, tagsArea, radioInstall, radioReset);


