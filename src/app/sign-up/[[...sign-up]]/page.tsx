'use client'
import * as Clerk from '@clerk/elements/common'
import * as SignUp from '@clerk/elements/sign-up'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/ui/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <SignUp.Root>
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              <SignUp.Step name="start">
                <div className="w-full max-w-sm rounded-xl border border-muted-foreground bg-background p-10">
                  <div className="grid gap-6">
                    <div className="flex flex-col gap-1">
                      <h1 className="text-lg font-bold">Sign up</h1>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Enter your information below to create an account
                      </p>
                    </div>
                    <Clerk.Field name="emailAddress" className="space-y-2">
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
                    <Clerk.Field name="password" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label className="font-semibold">Password</Label>
                      </Clerk.Label>
                      <Clerk.Input type="password" required asChild>
                        <Input
                          variant="ghost"
                          className="text-sm font-semibold"
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
                        <SignUp.Captcha className="empty:hidden" />
                        <SignUp.Action submit asChild>
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
                        </SignUp.Action>
                        <Button variant="link" size="sm" asChild>
                          <Clerk.Link
                            navigate="sign-in"
                            className="font-semibold"
                          >
                            Already have an account? Sign in
                          </Clerk.Link>
                        </Button>
                      </div>
                    </footer>
                  </div>
                </div>
              </SignUp.Step>

              <SignUp.Step name="continue">
                <div className="w-full max-w-sm rounded-xl border border-muted-foreground p-10">
                  <div className="flex flex-col gap-6">
                    <header className="grid gap-1">
                      <h1 className="text-lg font-bold">
                        Continue registration
                      </h1>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Enter your username below to continue
                      </p>
                    </header>
                    <Clerk.Field name="username" className="grid gap-2">
                      <Clerk.Label>
                        <Label className="font-semibold">Username</Label>
                      </Clerk.Label>
                      <Clerk.Input type="text" required asChild>
                        <Input className="font-semibold" variant="ghost" />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>
                    <footer>
                      <div className="grid w-full gap-y-4">
                        <SignUp.Action submit asChild>
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
                        </SignUp.Action>
                      </div>
                    </footer>
                  </div>
                </div>
              </SignUp.Step>

              <SignUp.Step name="verifications">
                <SignUp.Strategy name="email_code">
                  <div className="w-full min-w-sm rounded-xl border border-muted-foreground p-10">
                    <div className="flex flex-col gap-6">
                      <header className="grid gap-1">
                        <h1 className="text-lg font-bold">Verify your email</h1>
                        <p className="text-xs font-semibold text-muted-foreground">
                          Use the verification link sent to your email address
                        </p>
                      </header>
                      <div className="grid gap-y-4">
                        <div className="grid items-center justify-center gap-y-2">
                          <Clerk.Field name="code" className="space-y-2">
                            <Clerk.Label className="sr-only">
                              Email address
                            </Clerk.Label>
                            <div className="flex justify-center text-center">
                              <Clerk.Input
                                type="otp"
                                className="flex justify-center font-bold has-[:disabled]:opacity-50"
                                autoSubmit
                                render={({ value, status }) => {
                                  return (
                                    <div
                                      data-status={status}
                                      className={cn(
                                        'relative flex size-12 items-center justify-center border-y border-r border-input transition-all first:rounded-l-md first:border-l last:rounded-r-md font-semibold',
                                        {
                                          'z-10 ring-2 ring-ring ring-offset-background':
                                            status === 'cursor' ||
                                            status === 'selected',
                                        }
                                      )}
                                    >
                                      {value}
                                      {status === 'cursor' && (
                                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
                                        </div>
                                      )}
                                    </div>
                                  )
                                }}
                              />
                            </div>
                            <Clerk.FieldError className="block text-center text-sm text-destructive" />
                          </Clerk.Field>
                          <SignUp.Action
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
                            <Button type="button" variant="link" size="sm">
                              Didn&apos;t receive a code? Resend
                            </Button>
                          </SignUp.Action>
                        </div>
                        <footer>
                          <div className="grid w-full gap-y-4">
                            <SignUp.Action submit asChild>
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
                            </SignUp.Action>
                          </div>
                        </footer>
                      </div>
                    </div>
                  </div>
                </SignUp.Strategy>
              </SignUp.Step>
            </>
          )}
        </Clerk.Loading>
      </SignUp.Root>
    </div>
  )
}
