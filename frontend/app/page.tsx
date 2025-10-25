import Link from "next/link"
import { ArrowRight, MessageSquare, Map, BarChart } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            CareerShift AI
          </h1>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Your AI-Powered
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {" "}Career Transition{" "}
            </span>
            Companion
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Navigate your career change with confidence. Get personalized guidance,
            actionable plans, and expert coaching from AI agents tailored to your journey.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-lg hover:bg-purple-700 transition-all hover:scale-105"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-xl font-bold mb-3">Interactive Intake</h4>
            <p className="text-gray-600">
              Chat naturally with our AI to understand your goals, skills,
              and aspirations. It's like talking to a career advisor.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Map className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-xl font-bold mb-3">Personalized Plan</h4>
            <p className="text-gray-600">
              Receive a detailed roadmap with phases, milestones, and resources
              tailored specifically to your career transition.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-xl font-bold mb-3">Track Progress</h4>
            <p className="text-gray-600">
              Monitor your journey with an engaging dashboard, earn achievements,
              and stay motivated with daily streaks.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Career?</h3>
          <p className="text-lg mb-8 text-purple-100">
            Join thousands of professionals who have successfully transitioned to their dream careers.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 CareerShift AI. Built for the AI Prompt Championship.</p>
          <p className="mt-2 text-sm">Powered by AI Agents | Demo Platform</p>
        </div>
      </footer>
    </div>
  )
}
