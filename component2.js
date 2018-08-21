import React, { Component } from 'react';
import QRCode from 'qrcode.react';
import {
  Dropdown,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCol,
  IconBox,
} from '../components-ui';
import EditStamp from '../routes/Stamps/components/EditStamp';
import RemoveItem from './RemoveItem';

import { ReactComponent as CaretImg } from '../assets/images/caret-down.svg';
import { ReactComponent as StateImg } from '../assets/images/state.svg';
import DropdownButton from './DropdownButton';
import NoItems from '../components/NoItems';
import Summary from '../../src/routes/Stamps/components/Summary';
import PrintQrCode from '../../src/routes/Stamps/components/PrintQrCode';
import DisactivateStamp from '../routes/Stamps/components/DisactivateStamp';
import { API_URL } from '../api';
import Spinner from '../components-ui/Animation/Spinner';

class Filter extends Component {
  state = {
    loading: false,
    filter: null,
  };

  fetchStamps = (id = null, filter = null) => {
    this.setState({
      loading: true,
      filter
    });
    return this.props.fetchStamps(id)
      .then(() => {
        this.setState({
          loading: false,
          filter
        })
      });
  };

  renderStamps = (stamps) => stamps.map((item) => (
    <TableRow key={item.get('_id')}>
      <TableCol>
        <QRCode
          value={item.get('unique_hash')}
          size={60}
        />
      </TableCol>
      <TableCol>{item.get('name')}</TableCol>
      <TableCol>{item.getIn(['location', 'store_name'])}</TableCol>
      <TableCol>
        <IconBox
          IconComponent={StateImg}
          iconColor={item.get('active') ? '#24bb61' : '#f5494d'}
          text={item.get('active') ? 'Active' : 'Inactive'}
        />
      </TableCol>
      <TableCol>
        <EditStamp
          item={item}
          locations={this.props.locations}
          editStamp={this.props.editStamp}
        />
        <RemoveItem
          handleRemove={() => this.props.removeStamp(item.get('_id'))}
        />
        <Dropdown
          icon={CaretImg}
          text="More"
          reverse
          reverseDropdown
          iconWidth={13}
          margin={18}
          iconColor="#24bb61"
          rounded
          customClass="dropdown_rounded dropdown_colored"
          animateIcon="animate-rotate"
        >
          <DropdownButton
            onClick={() => this.props.downloadStampPdf(item.get('_id'))}
            blank
            className="dropdown-button"
          >
            Download QR Code
          </DropdownButton>
          <PrintQrCode
            account={this.props.account}
            className="dropdown-button"
            item={item}
          />
          <Summary
            className="dropdown-button"
            item={item}
          />
          <DisactivateStamp
            className="dropdown-button"
            item={item}
            disactivate={this.props.editStamp}
          />
        </Dropdown>
      </TableCol>
    </TableRow>
  ));

  renderFilterLocations = () => {
    return this.props.locations.map((item) => {
      return (
        <DropdownButton
          key={item._id}
          className="dropdown-button"
          onClick={() => this.fetchStamps(item._id, item.store_name)}
        >
          {item.store_name}
        </DropdownButton>
      )
    })
  };

  render() {
    return (
      <div className="filter">
        <div className="filter__intro">
          <div className="filter-group">
            <span className="label">Filter</span>
            <Dropdown
              icon={CaretImg}
              text={!this.state.filter ? 'All Locations' : `Location: ${this.state.filter}`}
              reverse
              reverseDropdown
              iconWidth={13}
              customClass="dropdown_rounded"
              animateIcon="animate-rotate"
            >
              {this.renderFilterLocations()}
              <DropdownButton
                className="dropdown-button"
                onClick={() => this.fetchStamps(null, null)}
              >
                All Locations
              </DropdownButton>
            </Dropdown>
          </div>
        </div>
        {this.state.loading &&
        <div className="spinner-wrapper">
          <Spinner />
        </div>
        }
        {this.props.stamps.size !== 0 && !this.state.loading &&
        <Table modifyClass="table_qr">
          <TableHead>
            <TableRow>
              <TableCol>QR CODES</TableCol>
              <TableCol>STAMP NAME</TableCol>
              <TableCol>LOCATION</TableCol>
              <TableCol>STATUS</TableCol>
              <TableCol>ACTIONS</TableCol>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.renderStamps(this.props.stamps)}
          </TableBody>
        </Table>
        }
        {this.props.stamps.size === 0 && !this.state.loading &&
        <NoItems
          itemsName="Stamps"
        />
        }
        <style jsx>{`
          .filter {
            margin-bottom: 90px;
            padding-top: 20px;
            border-top: 1px solid #dbd6d9;
          }
          .filter__intro {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 36px;
          }
        `}</style>
        <style jsx global>{`
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
          .dropdown-button {
            font-size: 16px;
            display: block;
            line-height: normal;
            text-align: left;
            font-family: 'Geometrica', sans-serif;
            color: #F7F7F5;
            background-color: #767676;
            width: 220px;
            padding: 12px 15px;
            transition: all .3s;
            border: none;
            text-decoration: none;
          }
          .dropdown-button:hover {
            cursor: pointer;
            transition: all .25s;
            color: #767676;
            background-color: #F7F7F5;
          }
          .dropdown-button:focus {
            outline: none;
          }
          .spinner-wrapper {
            display: flex;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }
}

export default Filter;
