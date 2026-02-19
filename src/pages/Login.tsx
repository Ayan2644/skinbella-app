/**
 * Login Page - Magic Link Authentication
 *
 * @author @dev (Dex) - Backend Squad
 * @version 2.0.0 (Magic Link)
 * @story 1.4 - Implement Magic Link Authentication
 */

import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Sparkles, Mail, ExternalLink, Loader2, Lock } from 'lucide-react'
import { sendMagicLink, KIWIFY_CHECKOUT_URL } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const Login = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const [loginMode, setLoginMode] = useState<'magic-link' | 'password'>('magic-link')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // Check for error param (from ProtectedRoute)
  useEffect(() => {
    const error = searchParams.get('error')
    if (error === 'subscription_required') {
      toast({
        title: 'Assinatura necessária',
        description: 'Você precisa de uma assinatura ativa para acessar o app.',
        variant: 'destructive'
      })
    }
  }, [searchParams, toast])

  const handlePasswordLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha email e senha.',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      })

      if (error) {
        console.error('Login error:', error)
        toast({
          title: 'Erro ao fazer login',
          description: error.message === 'Invalid login credentials'
            ? 'Email ou senha incorretos.'
            : error.message,
          variant: 'destructive'
        })
        setLoading(false)
        return
      }

      if (data.session) {
        toast({
          title: '✅ Login realizado!',
          description: 'Redirecionando...'
        })

        // Redirecionar para o app
        setTimeout(() => {
          navigate('/app')
        }, 500)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: 'Erro inesperado',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive'
      })
      setLoading(false)
    }
  }

  const handleMagicLinkLogin = async () => {
    if (!email.trim()) {
      toast({
        title: 'Email obrigatório',
        description: 'Por favor, insira seu email.',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)

    try {
      const result = await sendMagicLink(email.trim())

      if (result.needsSubscription) {
        toast({
          title: '❌ Assinatura necessária',
          description: result.error || 'Você precisa assinar para acessar o app.',
          variant: 'destructive'
        })
        setLoading(false)
        return
      }

      if (!result.success) {
        toast({
          title: 'Erro ao enviar link',
          description: result.error || 'Tente novamente.',
          variant: 'destructive'
        })
        setLoading(false)
        return
      }

      // Success!
      setEmailSent(true)
      toast({
        title: '✅ Link enviado!',
        description: `Verifique o email ${email.trim()}`
      })
    } catch (error) {
      console.error('Error sending magic link:', error)
      toast({
        title: 'Erro inesperado',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loginMode === 'password') {
      await handlePasswordLogin()
    } else {
      await handleMagicLinkLogin()
    }
  }

  const handleGoToCheckout = () => {
    window.open(KIWIFY_CHECKOUT_URL, '_blank')
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full animate-fade-in text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-porcelain flex items-center justify-center">
            <Mail className="w-10 h-10 text-accent" />
          </div>

          <h1 className="text-2xl font-bold text-foreground font-['Playfair_Display'] mb-2">
            Verifique seu email ✨
          </h1>

          <p className="text-muted-foreground mb-2">
            Enviamos um link de acesso para:
          </p>

          <p className="text-foreground font-medium mb-6">{email}</p>

          <div className="bg-muted/50 rounded-2xl p-6 mb-6 border border-border/50">
            <p className="text-sm text-muted-foreground mb-2">
              📧 Clique no link do email para acessar o app
            </p>
            <p className="text-xs text-muted-foreground">
              O link expira em 1 hora
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => {
                setEmailSent(false)
                setEmail('')
              }}
              variant="outline"
              className="w-full rounded-2xl h-12"
            >
              Enviar para outro email
            </Button>

            <button
              onClick={() => navigate('/')}
              className="block w-full text-sm text-muted-foreground underline underline-offset-2"
            >
              Voltar ao quiz
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-sm w-full animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl gradient-porcelain flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-foreground font-['Playfair_Display'] mb-1">
            Acesse o SkinBella
          </h1>
          <p className="text-sm text-muted-foreground">
            Entre com seu email de assinante
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              Email da Assinatura
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="mt-1 rounded-xl h-12"
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Use o email cadastrado na Kiwify
            </p>
          </div>

          {loginMode === 'password' && (
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 rounded-xl h-12"
                required
                disabled={loading}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full rounded-2xl h-14 text-base font-semibold shadow-elegant"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {loginMode === 'password' ? 'Entrando...' : 'Enviando link...'}
              </>
            ) : (
              <>
                {loginMode === 'password' ? (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Entrar com senha
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar link de acesso
                  </>
                )}
              </>
            )}
          </Button>

          {/* Toggle entre Magic Link e Password */}
          <button
            type="button"
            onClick={() => setLoginMode(loginMode === 'magic-link' ? 'password' : 'magic-link')}
            className="w-full text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
          >
            {loginMode === 'magic-link'
              ? '🔑 Já tenho uma conta - Entrar com senha'
              : '✉️ Receber link de acesso por email'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground text-center mb-3">
            Ainda não é assinante?
          </p>
          <Button
            onClick={handleGoToCheckout}
            variant="outline"
            className="w-full rounded-2xl h-12 text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Assinar agora
          </Button>
        </div>

        <button
          onClick={() => navigate('/')}
          className="block mx-auto mt-6 text-xs text-muted-foreground underline underline-offset-2"
        >
          Voltar ao quiz
        </button>
      </div>
    </div>
  )
}

export default Login
