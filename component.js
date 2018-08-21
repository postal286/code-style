import React, { Component } from 'react';
import moment from 'moment';
import { SpanAdapter, TextMask } from 'react-text-mask-hoc';
import { Link } from 'react-router-dom';

import { Dropdown, Table, TableBody, TableCol, TableHead, TableRow } from '../components-ui';
import { Pagination } from '../components'
import Spinner from '../components-ui/Animation/Spinner';
import { ReactComponent as CaretImg } from '../assets/images/caret-down.svg';
import DropdownButton from './DropdownButton';
import { NoValue, phoneMask } from '../common';

class CustomersHistory extends Component {
  state = {
    showBy: 10,
    currentPage: 1,
    loading: false,
    startDate: moment(),
    endDate: moment(),
  };

  onPageChange = (currentPage) => {
    this.setState({ loading: true, currentPage }, () => {
      this.props.fetchCustomers(null, this.state.showBy, currentPage)
        .finally(() => this.setState({ loading: false }));
    });
  };

  onChangeShowBy = (showBy) => {
    this.setState({ loading: true, showBy }, () => {
      this.props.fetchCustomers(null, showBy, this.state.currentPage)
        .finally(() => this.setState({ loading: false }));
    });
  };

  renderTableCustomerHeader = () => {
    return (
      <TableRow>
        <TableCol>
          <span>CUSTOMER</span>
        </TableCol>
        <TableCol>
          <span>JOIN DATE</span>
        </TableCol>
        <TableCol>
          <span>LAST STAMP</span>
        </TableCol>
        <TableCol>
          <span>LAST REDEEMED</span>
        </TableCol>
        <TableCol>
          <span>STAMPS</span>
        </TableCol>
        <TableCol>
          <span>REDEEMS</span>
        </TableCol>
      </TableRow>
    );
  };

  renderTableCustomerBody = (items) => {
    return items.map(item =>
        <TableRow
          key={item._id}
          className='history__table-wrapper'
        >
          <TableCol>
            <Link
              className="history__user-link"
              to={`/customers/${item.phone}`}
            >
            <span>
              {item.name ?
                item.name
                :
                <TextMask
                  Component={SpanAdapter}
                  value={item.phone}
                  mask={phoneMask}
                  guide={false}
                  id={item._id}
                />
              }
            </span>
            </Link>
          </TableCol>
          <TableCol>
            <span>{item.created_at ? moment(item.created_at).format('D/MM/YYYY') : NoValue}</span>
          </TableCol>
          <TableCol>
            <span>{item.last_stamp ? moment(item.last_stamp).format('D/MM/YYYY') : NoValue}</span>
          </TableCol>
          <TableCol>
            <span>{item.last_redeemed ? moment(item.last_redeemed).format('D/MM/YYYY') : NoValue}</span>
          </TableCol>
          <TableCol>
            <span>{item.stamps ? item.stamps : NoValue}</span>
          </TableCol>
          <TableCol>
            <span>{item.redeems ? item.redeems : NoValue}</span>
          </TableCol>
        </TableRow>,
    );
  };

  render() {
    const {
      customers: {
        customers = [],
        pages,
      },
    } = this.props;

    return (
      <div className="history">
        <Table modifyClass='table_history-customer'>
          <TableHead>
            {this.renderTableCustomerHeader()}
          </TableHead>
          <TableBody>
            {!this.state.loading && this.renderTableCustomerBody(customers)}
            {this.state.loading &&
            <div style={{
              minHeight: '560px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Spinner/>
            </div>
            }
          </TableBody>
        </Table>
        <div className="history__group">
          <div className="controls">
            Show
            <Dropdown
              icon={CaretImg}
              text={this.state.showBy}
              reverse
              iconWidth={13}
              customClass="dropdown_rounded"
              animateIcon="animate-rotate"
              margin={20}
            >
              <DropdownButton
                onClick={() => this.onChangeShowBy(5)}
                className="dropdown-button"
              >
                5
              </DropdownButton>
              <DropdownButton
                onClick={() => this.onChangeShowBy(10)}
                className="dropdown-button"
              >
                10
              </DropdownButton>
              <DropdownButton
                onClick={() => this.onChangeShowBy(20)}
                className="dropdown-button"
              >
                20
              </DropdownButton>
            </Dropdown>
            Rows
          </div>
          {pages > 1 &&
          <Pagination
            onPageChange={this.onPageChange}
            pageCount={pages}
          />
          }
        </div>
        <style jsx>{`
          .history {
            padding: 45px 40px 0 30px;
            border-top: 1px solid #dbd6d9;
          }
          .history__header {
            margin-bottom: 27px;
          }
          .history__intro {
            margin-bottom: 46px;
          }
          .history__group {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .history__group .controls {
            display: flex;
            align-items: center;
          }
          .filter-bar {
            display: flex;
            align-items: center;
            margin-bottom: 39px;
            padding-left: 50px;
          }
          .list.list_icon {
            display: flex;
          }
          .list.list_icon .list__item {
            margin-right: 16px;
            padding-left: 12px;
            font-size: 14px;
            color: #595a5a;
            border-left: 1px solid #dbd6d9;
          }
          .list.list_icon .list__item:last-child {
            margin-right: 0;
          }
          .filter-group {
            margin-right: 24px;
          }
          .history .title_secondary {
            font-size: 28px;
          }
        `}</style>
        <style jsx global>{`
          .history__user-link {
            color: #595a5a;
            text-decoration: none;
          }
          .history__user-link:hover {
            text-decoration: underline;
          }
          .filter-group {
            display: flex;
            align-items: center;
          }
          .filter-group .label {
            margin-right: 22px;
            color: #595a5a;
            font-size: 14px;
            line-height: 52px;
          }
          .history .history__group .dropdown {
            margin: 0px 15px 0 9px;
            padding: 7px 13px 5px 25px;
          }
          .history__table-wrapper {
            min-height: 560px;
          }
        `}</style>
      </div>
    );
  }
}

export default CustomersHistory;
