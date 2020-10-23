import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/admin/menu/list',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/admin/menu/create',
    method: 'post',
    data
  })
}

export function one(data) {
  return request({
    url: '/admin/menu/one',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/admin/menu/update',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/admin/menu/delete',
    method: 'post',
    data
  })
}

export function setTop(data) {
  return request({
    url: '/admin/menu/set-top',
    method: 'post',
    data
  })
}

export function cancelTop(data) {
  return request({
    url: '/admin/menu/cancel-top',
    method: 'post',
    data
  })
}
