#import "AppDelegate.h"
#import <Firebase.h>
#import <FirebaseCore.h>
#import <FirebaseFirestore.h>
#import <FirebaseAuth.h>
#import <UserNotifications/UserNotifications.h>
#import <FirebaseMessaging.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    self.moduleName = @"Yomentor";
    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = @{};
    
    // Add Firebase initialization here
    [FIRApp configure];
    
    // Request user authorization for notifications
    [UNUserNotificationCenter currentNotificationCenter].delegate = self;
    UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
    [[UNUserNotificationCenter currentNotificationCenter] requestAuthorizationWithOptions:authOptions completionHandler:^(BOOL granted, NSError * _Nullable error) {
        if (granted) {
            NSLog(@"User granted notification permissions.");
        } else {
            NSLog(@"User did not grant notification permissions.");
        }
    }];
    
    // Register for remote notifications
    [application registerForRemoteNotifications];
    
    // Set FIRMessaging delegate
    [FIRMessaging messaging].delegate = self;
    
    // Retrieve FCM registration token
    [[FIRMessaging messaging] tokenWithCompletion:^(NSString *token, NSError *error) {
        if (error != nil) {
            NSLog(@"Error getting FCM registration token: %@", error);
        } else {
            NSLog(@"FCM registration token: %@", token);
            // Handle the token as needed, for example, you can store it or send it to your server
            // You can also update UI components with the token if necessary
        }
    }];
    
    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
    return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
    return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
    return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

#pragma mark - FIRMessagingDelegate

- (void)messaging:(FIRMessaging *)messaging didReceiveRegistrationToken:(NSString *)fcmToken {
    NSLog(@"FCM registration token: %@", fcmToken);
    // Notify about received token.
    NSDictionary *dataDict = [NSDictionary dictionaryWithObject:fcmToken forKey:@"token"];
    [[NSNotificationCenter defaultCenter] postNotificationName:@"FCMToken" object:nil userInfo:dataDict];
    // TODO: If necessary send token to application server.
    // Note: This callback is fired at each app startup and whenever a new token is generated.
}


@end
