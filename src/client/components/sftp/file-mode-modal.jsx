/**
 * file props
 */

import React from 'react'
import {Icon, Modal, Button} from 'antd'
import resolve from '../../common/resolve'
import moment from 'moment'
import _ from 'lodash'
import {mode2permission, permission2mode} from '../../common/mode2permission'
import renderPermission from './permission-render'

const {prefix} = window
const e = prefix('sftp')
const formatTime = time => {
  return moment(time).format()
}

export default class FileMode extends React.Component {

  state = {
    file: null
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.file &&
      !_.isEqual(nextProps.file, this.props.file)
    ) {
      this.setState({
        file: this.addPermission(nextProps.file)
      })
    }
  }

  addPermission = file => {
    let perms = mode2permission(file.mode)
    let permission = permission2mode(perms)
    let mode = new Number('0o' + '10' + permission)
    return {
      ...file,
      permission,
      mode
    }
  }

  onChangePermission = (name, permName) => {
    let {file} = this.state
    let perms = mode2permission(file.mode)
    let i = _.findIndex(perms, p => p.name === name)
    _.update(
      perms,
      `[${i}].permission.${permName}`,
      b => !b
    )
    let permission = permission2mode(perms)
    let mode = new Number('0o' + '10' + permission)
    this.setState({
      file: {
        ...file,
        permission,
        mode
      }
    })
  }

  onSubmit = () => {
    this.props.changeFileMode(
      this.state.file
    )
  }

  renderFooter() {
    
    return (
      <Button
        type="primary"
        onClick={this.onSubmit}
      >
        {e('submit')}
      </Button>
    )
  }

  render() {
    let {
      visible,
      tab,
      onClose
    } = this.props
    if (!visible) {
      return null
    }
    let {file} = this.state
    let {
      name,
      size,
      accessTime,
      modifyTime,
      isDirectory,
      path,
      mode,
      type
    } = file
    let {
      host,
      port,
      username
    } = tab
    let iconType = isDirectory ? 'folder' : 'file'
    let ps = {
      visible,
      width: 500,
      title: `${e('edit')} ` + iconType + ` ${e('permission')}`,
      footer: this.renderFooter(),
      onCancel: onClose
    }
    let fp = resolve(path, name)
    let ffp = type === 'local'
      ? fp
      : `${username}@${host}:${port}:${fp}`

    let perms = mode2permission(mode)
    let permission = permission2mode(perms)

    return (
      <Modal
        {...ps}
      >
        <div className="file-props-wrap relative">
          <Icon type={iconType} className="file-icon" />
          <div className="file-props">
            <p className="bold">{iconType} {e('name')}:</p>
            <p className="pd1b">{name}</p>
            <p className="bold">{e('mode')}: ({permission})</p>
            <div className="pd1b">
              {
                perms.map((perm) => {
                  return renderPermission(
                    perm,
                    this.onChangePermission
                  )
                })
              }
            </div>
            <p className="bold">{e('fullPath')}:</p>
            <p className="pd1b">{ffp}</p>
            <p className="bold">{e('size')}:</p>
            <p className="pd1b">{size}</p>
            <p className="bold">{e('accessTime')}:</p>
            <p className="pd1b">{formatTime(accessTime)}</p>
            <p className="bold">{e('modifyTime')}:</p>
            <p className="pd1b">{formatTime(modifyTime)}</p>
          </div>
        </div>
      </Modal>
    )
  }

}
