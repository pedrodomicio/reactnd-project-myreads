import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import './App.css'
import SearchPage from './SearchPage.js'
import Header from './Header.js'
import BookShelf from './BookShelf.js'


class BooksApp extends Component {

  state = {
    booksOnShelf: [],
    searchResults: [],
  }

  componentDidMount() {
    BooksAPI.getAll().then((allReturnedBooks) => {
      this.setState({booksOnShelf : allReturnedBooks})
    });
  }

  handleSearch = (query) => {
   if (query !== ' ') {
     BooksAPI
     .search(query.trim(), 10)
     .then((allSearchResults) => {
       if (allSearchResults && allSearchResults.length) {
         const verifiedResults = allSearchResults.map((book) => {
           this.state.booksOnShelf.forEach((bookOnShelf) => {
             if (book.id == bookOnShelf.id) {
               book.shelf = bookOnShelf.shelf;
             }
           });
           return book;
         });
         this.setState({searchResults: verifiedResults})
       } else {
         this.setState({searchResults: []})
       }
     });
   }
  }

    handleChange = (bookToMove, shelfSelected) => {
      BooksAPI.update(bookToMove, shelfSelected)
        .then(() => {
          this.setState((state) => {
            let newShelfState = state.booksOnShelf.map(book => {
              book.id === bookToMove.id && (book.shelf = shelfSelected);
              return book;
            });
            return {booksOnShelf: newShelfState};
          });
        });
    }

    handleAddFromSearch = (bookToAdd, shelfSelected) => {
      BooksAPI.update(bookToAdd, shelfSelected)
        .then(() => {
          BooksAPI.get(bookToAdd.id)
          .then((bookRetrieved) => {
            this.setState((state) => {
              let newShelfState = state.booksOnShelf.concat(bookRetrieved);
              return {booksOnShelf: newShelfState}
            })
            this.setState((state) => {
              let newSearchResults = state.searchResults.map(book => {
                book.id === bookToAdd.id && (book.shelf = shelfSelected);
                return book;
              });
            });
          });
        });
    }



  render() {

    const { booksOnShelf, searchResults } = this.state

    return (
      <div className="app">
        <Route exact path="/" render={() => (
          <div>
            <Header/>
            <div className="list-books-content">
                <BookShelf
                  title = "Currently Reading"
                  booksOnShelf = {booksOnShelf.filter((book) => book.shelf === "currentlyReading")}
                  onChangeShelf={this.handleChange}
                />
                <BookShelf
                  title = "Want to Read"
                  booksOnShelf = {booksOnShelf.filter((book) => book.shelf === "wantToRead")}
                  onChangeShelf={this.handleChange}
                />
                <BookShelf
                  title = "Read"
                  booksOnShelf = {booksOnShelf.filter((book => book.shelf === "read"))}
                  onChangeShelf={this.handleChange}
                />
            </div>
            <div className="open-search">
              <Link to="/search"></Link>
            </div>
          </div>
        )}
       />

        <Route exact path="/search" render={() => (
          <SearchPage
            searchResults={searchResults}
            onChangeShelf={this.handleAddFromSearch}
            onSearch={this.handleSearch}
          />
        )}
        />
      </div>
    )
  }
}

export default BooksApp;
