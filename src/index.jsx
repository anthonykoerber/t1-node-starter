/**
 * To run:
 * - npm install
 * - Make a file credentials.js in the same directory as this file following this format:
 *		module.exports = {
 * 			user: YOUR COMPASS USER,
 * 			password: YOUR COMPASS PASSWORD
 *		}
 * - gulp reactor
 * - This will start both webpack and the local proxy server
 */

import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { T1Connection, EntityList, Entity } from 'terminalone'
import { Grid, List, InfiniteLoader } from 'react-virtualized'
import { Button, Popover, Position, Menu, MenuItem } from '@blueprintjs/core'
// import { Table, Column, Cell, ColumnHeaderCell, EditableCell } from '@blueprintjs/table'
import { user, password, api_key } from './credentials.js'

var config = {
	apiBaseUrl: 'http://localhost:8080',
	user: user,
	password: password,
	api_key: api_key }
var connection = new T1Connection(config);
var campaigns = [];

const PAGE_SIZE = 100;
const STATUS_LOADING = 1;
const STATUS_LOADED = 2;

function CampaignPlaceholder() {
	return <span className="pt-skeleton">{(new Array(8+Math.floor(Math.random()*10))).join('0')}</span>
}

class Main extends Component {
	constructor(props) {
		super(props)

		this.state = {
			rowCount: 10,
			loadedRowsMap: {}
		}

		this._isRowLoaded = this._isRowLoaded.bind(this)
		this._loadMoreRows = this._loadMoreRows.bind(this)
		this._rowRenderer = this._rowRenderer.bind(this)
	}

	_isRowLoaded ({ index }) {
		let { loadedRowsMap } = this.state;
		return !!loadedRowsMap[ index ]
	}

	_loadMoreRows ({ startIndex, stopIndex }) {
		let startTime = Date.now()
		console.log( `Loading rows #${startIndex} through #${startIndex+PAGE_SIZE} ` )

		let { rowCount, loadedRowsMap } = this.state;
		for(let i=startIndex; i<startIndex+PAGE_SIZE; i++) {
			loadedRowsMap[i] = STATUS_LOADING
		}
		console.log( `It took ${Date.now()-startTime}ms to mark the rows as loading` )

		let pageResponder = list => {
			let startOfResponder = Date.now()
			let acc = 0;
			for(let entity of list.entities) {
				campaigns[startIndex+acc] = entity
				acc++
			}
			console.log( `It took ${Date.now() - startOfResponder}ms to add entities to the list` )

			this.setState({ rowCount: list.meta.total_count })
			
			let startOfLoaded = Date.now()
			for(let i=startIndex; i<startIndex+PAGE_SIZE; i++) {
				loadedRowsMap[i] = STATUS_LOADED
			}
			console.log( `It took ${Date.now() - startOfLoaded}ms to mark the rows as loaded` )
			console.log( `It took ${Date.now() - startTime}ms to load the whole page` )
		}

		return EntityList.get('campaigns', connection, {
			page_limit: PAGE_SIZE,
			page_offset: startIndex,
			full: ['*']
		})
		.then(pageResponder)

		// if( !currentPage ) {
		// 	return EntityList.get('campaigns', connection, {
		// 		page_limit: (stopIndex - startIndex),
		// 		page_offset: startIndex,
		// 		full: ['*']
		// 	})
		// 	.then(pageResponder)
		// } else {
		// 	return EntityList.getNextPage(currentPage, connection)
		// 	.then(pageResponder)
		// }
	}

	_rowRenderer ({index, key, style}) {
		let { loadedRowsMap } = this.state;
		return <div key={key} style={style}>
			<a className="pt-menu-item">
				{loadedRowsMap[index] === STATUS_LOADED ? campaigns[index].name : <CampaignPlaceholder/>}
			</a>
		</div>
	}

	render() {
		let { rowCount } = this.state;
		return (
			<div>
 
				<Popover
					popoverClassName="pt-minimal"
					content={
						<InfiniteLoader
						isRowLoaded={this._isRowLoaded}
						loadMoreRows={this._loadMoreRows}
						threshold={100}
						rowCount={rowCount}
						>
							{({ onRowsRendered, registerChild }) =>
								<List
									width={170}
									height={300}
									rowCount={rowCount}
									rowHeight={30}

									ref={registerChild}
									rowRenderer={this._rowRenderer}
									onRowsRendered={onRowsRendered}
									>
								</List>}
						</InfiniteLoader>
					} position={Position.BOTTOM_LEFT}>
					<Button iconName="share" text="It Works" />
				</Popover>

				<span>&nbsp;</span>

				<InfiniteLoader
					isRowLoaded={this._isRowLoaded}
					loadMoreRows={this._loadMoreRows}
					threshold={100}
					rowCount={rowCount}
					>
					{ ({onRowsRendered, registerChild}) =>
						<Grid
							columnCount={14}
							columnWidth={160}
							rowHeight={30}
							rowCount={rowCount}
							cellRenderer={({rowIndex, columnIndex, key, style})=><div key={key} style={style}>c{columnIndex} r{rowIndex}</div>}
							width={800}
							height={600}
							onSectionRendered={({rowStartIndex, rowStopIndex}) => onRowsRendered(rowStartIndex, rowStopIndex)}
							ref={registerChild}
						/> }
				</InfiniteLoader>

			</div>
		)
	}
}

ReactDOM.render(<Main />, document.getElementById('container'))