import React from 'react'

interface State {
  hasError: boolean
  errorMessage: string
}

export default class GlobalErrorBoundary extends React.Component<{
  children: React.ReactNode
}, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, errorMessage: 'Đã xảy ra lỗi không xác định.' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message || 'Đã xảy ra lỗi không xác định.' }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Tập trung xử lý exception tại đây
    // Có thể tích hợp thêm hệ thống logging hoặc monitoring
    console.error('[GlobalErrorBoundary] ', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="global-error-boundary" role="alert" style={{ padding: 24 }}>
          <h1>Xin lỗi, có lỗi xảy ra</h1>
          <p>{this.state.errorMessage}</p>
        </div>
      )
    }

    return this.props.children
  }
}
