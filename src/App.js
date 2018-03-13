import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Search from './Search'
import CurrentlyReading from './CurrentlyReading'
import WantToRead from './WantToRead'
import Read from './Read'
import { Route } from 'react-router-dom'
import {Link} from 'react-router-dom'

class App extends React.Component {
    state = {
    books: []
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books })
    })
  }

    searchBook(query, maxResults) {
      BooksAPI.search(query, maxResults).then(books => {
        this.setState(state => ({
          books: state.books.concat([ books ])
        }))
      })
    }

  render() {
    return (
      <div className="app">
        <div className="list-books-title">  <h1>MyReads</h1>  </div>

          <Route exact path="/"  render={() => (
            <div>
              <CurrentlyReading books={this.state.books} />
              <Read books={this.state.books}/>
              <WantToRead books={this.state.books} />
            </div>
          )}
          />
          <Route  path="/search" render={({ history }) => (
            <Search books={this.state.books} />
          )}/>
        <Link to="/search" className="open-search"></Link>
      </div>
    )
  }
}

export default App
