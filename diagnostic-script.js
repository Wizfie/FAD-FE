#!/usr/bin/env node
/**
 * FAD Data Fetch Diagnostic Tool
 *
 * This script helps diagnose issues with FAD data fetching.
 * Run this in the browser console (F12) after opening the FAD dashboard.
 */

// Function to test backend connectivity
async function testBackendConnection() {
  console.log('🧪 Testing backend connectivity...')
  try {
    const response = await fetch('http://localhost:5001/api/v1/get-fad', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log('📊 Response status:', response.status)
    console.log('📊 Response OK:', response.ok)
    const data = await response.json()
    console.log('📊 Response data:', data)
    return { success: response.ok, status: response.status, data }
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Function to test authenticated endpoint
async function testAuthenticatedEndpoint() {
  console.log('🧪 Testing authenticated endpoint...')

  // Try to get token from localStorage or sessionStorage
  const token =
    localStorage.getItem('auth_token') ||
    sessionStorage.getItem('auth_token') ||
    // Try to get from auth store if Vue is available
    window.__NUXT__?.auth?.accessToken ||
    window.__QUASAR__?.auth?.token

  if (!token) {
    console.warn('⚠️  No token found. User may not be logged in.')
    return { success: false, error: 'No authentication token found' }
  }

  console.log('✅ Token found (length:', token.length, ')')

  try {
    const response = await fetch('http://localhost:5001/api/v1/get-fad?status=open', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('📊 Response status:', response.status)
    console.log('📊 Response OK:', response.ok)
    const data = await response.json()
    console.log('📊 Response data:', data)
    return { success: response.ok, status: response.status, data }
  } catch (error) {
    console.error('❌ Authenticated request failed:', error.message)
    return { success: false, error: error.message }
  }
}

// Function to dump diagnostic information
async function dumpDiagnostics() {
  console.log('\n' + '='.repeat(60))
  console.log('📋 FAD FETCH DIAGNOSTICS')
  console.log('='.repeat(60) + '\n')

  // Check if Vue is available
  if (window.__VUE__) {
    console.log('✅ Vue is loaded')
  } else {
    console.log('❌ Vue not found')
  }

  // Check API setup
  console.log('\n📡 API Configuration:')
  console.log('  - Location:', window.location.href)
  console.log('  - Backend URL: http://localhost:5001')

  // Check authentication
  console.log('\n🔐 Authentication:')
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token')
  console.log('  - Token in localStorage:', !!localStorage.getItem('auth_token'))
  console.log('  - Token in sessionStorage:', !!sessionStorage.getItem('auth_token'))
  console.log('  - Token length:', token?.length || 0)

  // Check database
  console.log('\n💾 Database:')
  console.log('  - Check database through Postman or curl')

  // Check network
  console.log('\n🌐 Network:')
  console.log('  - Open DevTools Network tab')
  console.log('  - Look for requests to /api/v1/get-fad')
  console.log('  - Check Status, Headers, and Response')

  console.log('\n' + '='.repeat(60))
  console.log('🚀 Running tests...\n')

  // Test 1: Backend Connection (no auth)
  console.log('Test 1: Backend Connectivity (No Auth)')
  console.log('-'.repeat(40))
  const test1 = await testBackendConnection()
  console.log('Result:', test1.success ? '❌ UNEXPECTED SUCCESS' : '✅ Expected 401 Unauthorized')
  console.log('')

  // Test 2: Authenticated Request
  console.log('Test 2: Authenticated Request')
  console.log('-'.repeat(40))
  const test2 = await testAuthenticatedEndpoint()
  if (test2.success) {
    console.log('✅ Request successful')
    console.log('  - Data rows:', test2.data?.data?.data?.length || 0)
    console.log('  - Total count:', test2.data?.data?.meta?.total || 0)
  } else {
    console.log('❌ Request failed')
    console.log('  - Reason:', test2.error)
  }
  console.log('')

  console.log('='.repeat(60))
  console.log('📊 SUMMARY\n')

  if (test1.status === 401) {
    console.log('✅ Backend is responding (rejected unauthenticated request)')
  } else if (test1.success) {
    console.log('⚠️  Backend allowed unauthenticated request (unexpected)')
  } else {
    console.log('❌ Backend is NOT responding - check if server is running')
  }

  if (test2.success) {
    console.log('✅ Authentication is working')
  } else if (test2.error?.includes('No token')) {
    console.log('❌ User is NOT logged in - please login first')
  } else {
    console.log('❌ Authenticated request failed - check permission or module access')
  }

  console.log('\n' + '='.repeat(60))
}

// Run all diagnostics
dumpDiagnostics()
