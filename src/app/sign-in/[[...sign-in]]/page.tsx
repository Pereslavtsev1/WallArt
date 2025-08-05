'use client'
import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Icons } from '@/components/ui/icons'

export default function SignInPage() {
  return (
    <div className="flex min-h-dvh w-full items-center justify-center p-6 md:p-10">
      <SignIn.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              <SignIn.Step name="start">
                <div className="w-full max-w-sm rounded-xl border border-muted-foreground bg-background p-10 text-card-foreground shadow-lg">
                  <div className="grid gap-6">
                    <div className="flex flex-col gap-1">
                      <h1 className="text-lg font-bold">Sign in</h1>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Welcome back! Enter your details to continue
                      </p>
                    </div>
                    <Clerk.Field name="identifier" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label className="font-semibold">Email address</Label>
                      </Clerk.Label>
                      <Clerk.Input type="email" required asChild>
                        <Input
                          variant="ghost"
                          className="text-sm font-semibold"
                          placeholder="example@gmail.com"
                        />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>
                    <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                      or
                    </p>
                    <Clerk.Connection name="google" asChild>
                      <Button
                        className="w-full"
                        type="button"
                        disabled={isGlobalLoading}
                      >
                        <Clerk.Loading scope="provider:google">
                          {(isLoading) =>
                            isLoading ? (
                              <Icons.spinner className="size-4 animate-spin" />
                            ) : (
                              <>
                                <Icons.google className="mr-2 size-4" />
                                Login with Google
                              </>
                            )
                          }
                        </Clerk.Loading>
                      </Button>
                    </Clerk.Connection>
                    <footer>
                      <div className="grid w-full gap-y-4">
                        <SignIn.Action submit asChild>
                          <Button disabled={isGlobalLoading} className="w-full">
                            <Clerk.Loading>
                              {(isLoading) => {
                                return isLoading ? (
                                  <Icons.spinner className="size-4 animate-spin" />
                                ) : (
                                  'Continue'
                                )
                              }}
                            </Clerk.Loading>
                          </Button>
                        </SignIn.Action>
                        <Button
                          variant="link"
                          size="sm"
                          asChild
                          className="w-full"
                        >
                          <Clerk.Link
                            navigate="sign-up"
                            className="font-semibold"
                          >
                            Don&apos;t have an account? Sign up
                          </Clerk.Link>
                        </Button>
                      </div>
                    </footer>
                  </div>
                </div>
              </SignIn.Step>

              <SignIn.Step name="choose-strategy">
                <div className="w-full max-w-sm rounded-xl border border-muted-foreground bg-background p-10">
                  <div className="grid gap-6">
                    <header className="grid gap-1">
                      <h1 className="text-lg font-bold">Use another method</h1>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Facing issues? You can use any of these methods to sign
                        in.
                      </p>
                    </header>
                    <SignIn.SupportedStrategy name="email_code" asChild>
                      <Button
                        type="button"
                        variant="link"
                        disabled={isGlobalLoading}
                      >
                        Email code
                      </Button>
                    </SignIn.SupportedStrategy>
                    <SignIn.SupportedStrategy name="password" asChild>
                      <Button
                        type="button"
                        variant="link"
                        disabled={isGlobalLoading}
                      >
                        Password
                      </Button>
                    </SignIn.SupportedStrategy>
                    <footer>
                      <div className="grid w-full gap-y-4">
                        <SignIn.Action navigate="previous" asChild>
                          <Button disabled={isGlobalLoading}>
                            <Clerk.Loading>
                              {(isLoading) => {
                                return isLoading ? (
                                  <Icons.spinner className="size-4 animate-spin" />
                                ) : (
                                  'Go back'
                                )
                              }}
                            </Clerk.Loading>
                          </Button>
                        </SignIn.Action>
                      </div>
                    </footer>
                  </div>
                </div>
              </SignIn.Step>

              <SignIn.Step name="verifications">
                <SignIn.Strategy name="password">
                  <div className="w-full max-w-sm rounded-xl border border-muted-foreground bg-background p-10">
                    <div className="grid gap-6">
                      <header className="grid gap-1">
                        <h1 className="text-lg font-bold">
                          Enter your password
                        </h1>
                        <p className="text-xs font-semibold text-muted-foreground">
                          Welcome back <SignIn.SafeIdentifier />. Enter your
                          password below to continue
                        </p>
                      </header>
                      <Clerk.Field name="password" className="space-y-2">
                        <Clerk.Label asChild>
                          <Label>Password</Label>
                        </Clerk.Label>
                        <Clerk.Input type="password" asChild>
                          <Input
                            variant="ghost"
                            className="text-sm font-semibold"
                          />
                        </Clerk.Input>
                        <Clerk.FieldError className="block text-sm text-destructive" />
                      </Clerk.Field>
                      <footer>
                        <div className="grid w-full gap-y-4">
                          <SignIn.Action submit asChild>
                            <Button disabled={isGlobalLoading}>
                              <Clerk.Loading>
                                {(isLoading) => {
                                  return isLoading ? (
                                    <Icons.spinner className="size-4 animate-spin" />
                                  ) : (
                                    'Continue'
                                  )
                                }}
                              </Clerk.Loading>
                            </Button>
                          </SignIn.Action>
                          <SignIn.Action navigate="choose-strategy" asChild>
                            <Button type="button" size="sm" variant="link">
                              Use another method
                            </Button>
                          </SignIn.Action>
                        </div>
                      </footer>
                    </div>
                  </div>
                </SignIn.Strategy>

                <SignIn.Strategy name="email_code">
                  <div className="w-full max-w-sm rounded-xl border border-muted-foreground p-10">
                    <div className="flex flex-col gap-6">
                      <header className="grid gap-1">
                        <h1 className="text-lg font-bold">Check your email</h1>
                        <p className="text-xs font-semibold text-muted-foreground">
                          Enter the verification code sent to your email
                        </p>
                      </header>
                      <Clerk.Field name="code">
                        <Clerk.Label className="sr-only">
                          Email verification code
                        </Clerk.Label>
                        <div className="grid items-center justify-center gap-y-2">
                          <div className="flex justify-center text-center">
                            <Clerk.Input
                              type="otp"
                              autoSubmit
                              className="flex justify-center has-[:disabled]:opacity-50"
                              render={({ value, status }) => {
                                return (
                                  <div
                                    data-status={status}
                                    className="relative flex size-12 items-center justify-center border-y border-r border-input font-semibold transition-all first:rounded-l-md first:border-l last:rounded-r-md"
                                  >
                                    {value}
                                  </div>
                                )
                              }}
                            />
                          </div>
                          <Clerk.FieldError className="block text-center text-sm text-destructive" />
                          <SignIn.Action
                            asChild
                            resend
                            className="text-muted-foreground"
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            fallback={({ resendableAfter }: any) => (
                              <Button variant="link" size="sm" disabled>
                                Didn&apos;t receive a code? Resend (
                                <span className="tabular-nums">
                                  {resendableAfter}
                                </span>
                                )
                              </Button>
                            )}
                          >
                            <Button variant="link" size="sm">
                              Didn&apos;t receive a code? Resend
                            </Button>
                          </SignIn.Action>
                        </div>
                      </Clerk.Field>
                      <footer>
                        <div className="grid w-full gap-y-4">
                          <SignIn.Action submit asChild>
                            <Button disabled={isGlobalLoading}>
                              <Clerk.Loading>
                                {(isLoading) => {
                                  return isLoading ? (
                                    <Icons.spinner className="size-4 animate-spin" />
                                  ) : (
                                    'Continue'
                                  )
                                }}
                              </Clerk.Loading>
                            </Button>
                          </SignIn.Action>
                          <SignIn.Action navigate="choose-strategy" asChild>
                            <Button size="sm" variant="link">
                              Use another method
                            </Button>
                          </SignIn.Action>
                        </div>
                      </footer>
                    </div>
                  </div>
                </SignIn.Strategy>
              </SignIn.Step>
            </>
          )}
        </Clerk.Loading>
      </SignIn.Root>
    </div>
  )
}
