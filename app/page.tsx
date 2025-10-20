import ErrorBoundary from "@/src/components/ErrorBoundary";
import Dashboard from "../src/components/Dashboard"

const DashboardPage = () => {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  )
}

export default DashboardPage;