import React from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";

/*
Keen to try create something like the GitLab search box, where you get
field/category like filter options presented as you type in the drop-down and you
can select them and they appear in the input like a multi-select...

Keep reading this...
https://opensource.appbase.io/reactive-manual/search-components/categorysearch.html
*/

class SearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { input: "" };
    }

    updateInput(input){
        //updateInput = input => {
        this.setState({ input });
    }

    // handleAddTodo = () => {
    //     this.props.addTodo(this.state.input);
    //     this.setState({ input: "" });
    // };
    
    render() {
        return (
            <Form className="d-flex">
                <FormControl
                    type="input-sm"
                    placeholder="Search for anything..."
                    aria-label="Search"
                    aria-describedby="searchText"
                    onChange={e => this.updateInput(e.target.value)}
                    value={this.state.input}
                />
            </Form>);
    }
}

export default SearchInput;