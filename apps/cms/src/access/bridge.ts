import type { Access } from 'payload'

const BRIDGE_SECRET_HEADER = 'x-bridge-secret'
const BRIDGE_USER_HEADER = 'x-payload-user-id'
type AdminRole = 'superadmin' | 'admin' | 'support'

function getAdminUser(req: any) {
  const user = req?.user
  if (!user || user.collection !== 'admins') return null
  if (user.isActive === false) return null
  return user
}

function getPayloadUser(req: any) {
  const user = req?.user
  if (!user || user.collection !== 'users') return null
  return user
}

function hasRole(req: any, roles: AdminRole[]): boolean {
  const admin = getAdminUser(req)
  if (!admin) return false
  return roles.includes(admin.role)
}

export const isSupportOrAbove = ({ req }: any) =>
  hasRole(req, ['support', 'admin', 'superadmin'])

export const isOperationsAdmin = ({ req }: any) =>
  hasRole(req, ['admin', 'superadmin'])

export const isSuperAdmin = ({ req }: any) => hasRole(req, ['superadmin'])

export const isAdmin = ({ req }: any) => Boolean(getAdminUser(req))

function hasValidBridgeSecret(req: any): boolean {
  const expected = process.env.BRIDGE_INTERNAL_SECRET
  if (!expected) return false
  const provided = req.headers.get(BRIDGE_SECRET_HEADER)
  return Boolean(provided) && provided === expected
}

function getBridgeUserId(req: any): string | null {
  if (!hasValidBridgeSecret(req)) return null
  return req.headers.get(BRIDGE_USER_HEADER) || null
}

export const adminOrBridgeUserRead: Access = ({ req }) => {
  const payloadUser = getPayloadUser(req)
  if (payloadUser) {
    return {
      id: {
        equals: payloadUser.id,
      },
    }
  }

  const userId = getBridgeUserId(req)
  if (userId) {
    return {
      id: {
        equals: userId,
      },
    }
  }

  return isSupportOrAbove({ req })
}

export const adminOrBridgeUserUpdate: Access = ({ req }) => {
  const payloadUser = getPayloadUser(req)
  if (payloadUser) {
    return {
      id: {
        equals: payloadUser.id,
      },
    }
  }

  const userId = getBridgeUserId(req)
  if (userId) {
    return {
      id: {
        equals: userId,
      },
    }
  }

  return isOperationsAdmin({ req })
}

export const adminOrBridgeBookingRead: Access = ({ req }) => {
  const payloadUser = getPayloadUser(req)
  if (payloadUser) {
    return {
      user: {
        equals: payloadUser.id,
      },
    }
  }

  const userId = getBridgeUserId(req)
  if (userId) {
    return {
      user: {
        equals: userId,
      },
    }
  }

  return isSupportOrAbove({ req })
}

export const adminOrBridgeBookingUpdate: Access = ({ req }) => {
  const payloadUser = getPayloadUser(req)
  if (payloadUser) {
    return {
      user: {
        equals: payloadUser.id,
      },
    }
  }

  const userId = getBridgeUserId(req)
  if (userId) {
    return {
      user: {
        equals: userId,
      },
    }
  }

  return isOperationsAdmin({ req })
}

export const adminOrBridgeBookingCreate: Access = ({ req }) => {
  if (getPayloadUser(req)) return true
  if (getBridgeUserId(req)) return true
  return isOperationsAdmin({ req })
}

export const adminOrBridgeUserCreate: Access = ({ req }) => {
  if (isOperationsAdmin({ req })) return true
  return Boolean(hasValidBridgeSecret(req))
}

export const operationsReadAccess: Access = ({ req }) => isSupportOrAbove({ req })
export const operationsWriteAccess: Access = ({ req }) => isOperationsAdmin({ req })
export const operationsReadOrBridgeSecretAccess: Access = ({ req }) =>
  isSupportOrAbove({ req }) || hasValidBridgeSecret(req)
export const operationsWriteOrBridgeSecretAccess: Access = ({ req }) =>
  isOperationsAdmin({ req }) || hasValidBridgeSecret(req)
export const destructiveOperationsAccess: Access = ({ req }) => isOperationsAdmin({ req })
